import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ElasticsearchService } from 'packages/share/services/elastichsearch.service';
import { Channel } from 'amqplib';
import { Helper } from 'packages/utils/helper';
import {
  ExchangeRabbit,
  KeyRedis,
  OperationPSQL,
  TableName,
} from 'packages/common/constant';
import { NoteDetailsLIstener } from 'packages/interface/queues.interface';
import { RabbitService } from 'packages/share/services/rabbit.service';
import { RedisService } from 'packages/share/services/redis.service';

@Injectable()
export class NoteDetailsPubSubService implements OnModuleInit {
  private channel: Channel;
  private reconnectAttempts = 0;

  constructor(
    private rabbit: RabbitService,
    private readonly elasticsearchService: ElasticsearchService,
    private readonly redis: RedisService,
  ) {}

  async onModuleInit() {
    await this.consumeFromRabbit();
  }

  private async consumeFromRabbit() {
    try {
      this.channel = await this.rabbit.connectChannel();

      await this.channel.assertExchange(
        ExchangeRabbit.NOTE_DETAILS_EXCHANGE,
        'direct',
        { durable: true },
      );
      await this.channel.assertQueue(ExchangeRabbit.NOTE_DETAILS_QUEUE, {
        durable: true,
      });
      await this.channel.bindQueue(
        ExchangeRabbit.NOTE_DETAILS_QUEUE,
        ExchangeRabbit.NOTE_DETAILS_EXCHANGE,
        TableName.NOTE_DETAILS,
      );

      this.channel.consume(ExchangeRabbit.NOTE_DETAILS_QUEUE, async (msg) => {
        if (!msg) return;

        try {
          const payload = Helper.parseJson(msg?.content?.toString());
          if (!payload) {
            this.channel.nack(msg, false, false);
            return;
          }
          const content: string = await this.redis._getString(
            `${KeyRedis.CONTENT_NOTE_DETAIL}_${payload.id}`,
          );
          if (!content) {
            Logger.error('EMPTY_CONTENT', payload.id);
            throw new Error(`EMPTY_CONTENT_${payload.id}`);
          }
          if (payload.new_data) {
            payload.new_data.content = content;
          }
          await this.processMessage(payload);
          this.channel.ack(msg);
        } catch (error) {
          Logger.error(`Error processing message: ${error.message}`);
          this.channel.nack(msg, false, true);
        }
      });

      this.channel.on('close', async () => {
        Logger.error('RabbitMQ channel closed, reconnecting...');
        await this.retryRabbitMQConnection();
      });

      this.reconnectAttempts = 0;
    } catch (error) {
      Logger.error('Error connecting to RabbitMQ', error);
      await this.retryRabbitMQConnection();
    }
  }

  private async retryRabbitMQConnection() {
    if (this.reconnectAttempts >= 5) {
      Logger.error('RabbitMQ retry limit reached, exiting...');
      return;
    }

    this.reconnectAttempts++;
    Logger.warn(
      `Retrying RabbitMQ connection (${this.reconnectAttempts}/5) in 5s...`,
    );
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await this.consumeFromRabbit();
  }

  async processMessage(payload: NoteDetailsLIstener) {
    if (
      [OperationPSQL.INSERT, OperationPSQL.UPDATE].includes(payload.operation)
    ) {
      await this.elasticsearchService.indexData(
        TableName.NOTE_DETAILS,
        payload.new_data.id.toString(),
        payload.new_data,
      );
    }
    if (payload.operation === OperationPSQL.DELETE && payload.id) {
      await this.redis._del(`${KeyRedis.CONTENT_NOTE_DETAIL}_${payload.id}`);
      await this.elasticsearchService.deleteData(
        TableName.NOTE_DETAILS,
        payload.id.toString(),
      );
    }
  }

  async publishToRabbit(payload: any) {
    this.channel.publish(
      ExchangeRabbit.NOTE_DETAILS_EXCHANGE,
      TableName.NOTE_DETAILS,
      Buffer.from(JSON.stringify(payload)),
      { persistent: true },
    );
  }
}
