import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import { config } from 'packages/config';

@Injectable()
export class RabbitService implements OnModuleDestroy {
  private static connection: amqp.Connection;

  private static channel: amqp.Channel;

  private readonly NUMBER_RETRY = config.NUMBER_RETRY;

  private readonly NUMBER_DELAY = config.NUMBER_DELAY;

  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor() {}

  async connectChannel(numberPrefetch: number = 50): Promise<amqp.Channel> {
    try {
      if (!RabbitService.connection) {
        RabbitService.connection = await this.createConnection();
      }

      if (!RabbitService.channel) {
        RabbitService.channel = await RabbitService.connection.createChannel();

        RabbitService.channel.on('error', (err) => this.reconnect(err));
        RabbitService.channel.on('close', (err) => this.reconnect(err));

        RabbitService.channel.prefetch(numberPrefetch);
        Logger.log('RabbitMQ Channel Connected');
      }

      return RabbitService.channel;
    } catch (err) {
      Logger.error(`Error connecting to RabbitMQ: ${err.message}`);
      await this.delay(this.NUMBER_DELAY);
      return this.connectChannel();
    }
  }

  private async createConnection(): Promise<amqp.Connection> {
    let attempts = 0;
    while (attempts < this.NUMBER_RETRY) {
      try {
        Logger.log('Connecting to RabbitMQ...');
        const connection = await amqp.connect(config.RABBIT.URL);
        connection.on('close', () => this.reconnect());
        return connection;
      } catch (err) {
        attempts++;
        Logger.error(`RabbitMQ connection failed (Attempt ${attempts}): ${err.message}`);
        await this.delay(2 ** attempts * this.NUMBER_DELAY);
      }
    }
    throw new Error('Max retries reached. RabbitMQ connection failed.');
  }

  private async reconnect(err?: Error) {
    if (err) {
      Logger.error(`RabbitMQ Reconnect: ${err.message}`);
    }
    RabbitService.connection = null;
    RabbitService.channel = null;
    await this.connectChannel();
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async onModuleDestroy() {
    if (RabbitService.channel) {
      await RabbitService.channel.close();
      Logger.log('RabbitMQ Channel Closed');
    }
    if (RabbitService.connection) {
      await RabbitService.connection.close();
      Logger.log('RabbitMQ Connection Closed');
    }
  }
}
