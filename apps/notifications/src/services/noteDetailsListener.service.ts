import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { TableName } from 'packages/common/constant';
import { config } from 'packages/config';
import { Helper } from 'packages/utils/helper';
import { Client } from 'pg';
import { NoteDetailsPubSubService } from './noteDetailsPubSubService';
import {
  NoteDetailsLIstener,
  OperationPSQL,
  ValueListener,
} from 'src/common/interface/noteDetails.interface';
import { NoteDetailType } from '@prisma/client';
import { NoteDetailQueueTTLService } from './noteDetailsQueueTTL.service';

@Injectable()
export class NoteDetailsListenerService
  implements OnModuleInit, OnModuleDestroy
{
  private client: Client;
  private reconnectAttempts = 0;

  constructor(
    private noteDetailsPubSubService: NoteDetailsPubSubService,
    private noteDetailQueueTTLService: NoteDetailQueueTTLService,
  ) {
    this.client = new Client({
      user: config.PSQL.USER,
      host: config.PSQL.HOST,
      database: config.PSQL.DB,
      password: config.PSQL.PASSWORD,
      port: config.PSQL.PORT,
    });
  }

  async onModuleInit() {
    await this.connectPostgres();
  }

  private async connectPostgres() {
    try {
      await this.client.connect();
      Logger.log('Listening for database changes...');
      await this.client.query(`LISTEN ${ValueListener.NOTE_DETAIL_CHANNEL}`);

      this.client.on('notification', (msg) => {
        const payload: NoteDetailsLIstener = Helper.parseJson(msg?.payload);
        if (!payload) return;
        if (!Object.values(OperationPSQL).includes(payload.operation)) return;
        if (!payload.table || payload.table !== TableName.NOTE_DETAILS) return;
        if (
          payload.new_data &&
          payload.new_data.type === NoteDetailType.schedule &&
          payload.new_data['schedule_time']
        ) {
          payload.new_data.scheduleTime = payload.new_data['schedule_time'];
          payload.new_data.userId = payload.new_data['user_id'];
          this.noteDetailQueueTTLService.PublishQueueDelay(payload.new_data);
        }
        this.noteDetailsPubSubService.publishToRabbit(payload);
      });

      this.client.on('error', async (err) => {
        Logger.error('PostgreSQL connection lost, retrying...', err);
        await this.retryPostgresListener();
      });

      this.reconnectAttempts = 0;
    } catch (error) {
      Logger.error('Error connecting to PostgreSQL', error);
      await this.retryPostgresListener();
    }
  }

  private async retryPostgresListener() {
    if (this.reconnectAttempts >= 5) {
      Logger.error('PostgreSQL retry limit reached, exiting...');
      return;
    }

    this.reconnectAttempts++;
    Logger.warn(
      `Retrying PostgreSQL connection (${this.reconnectAttempts}/5) in 5s...`,
    );
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await this.connectPostgres();
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.end();
      Logger.log('Disconnected from PostgreSQL');
    }
  }
}
