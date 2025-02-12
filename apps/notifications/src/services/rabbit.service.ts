import { Injectable, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';
import { config } from 'packages/config';

@Injectable()
export class RabbitService {
  private channel: amqp.Channel;
  private connection: amqp.Connection;
  private NUMBER_RETRY: number = config.NUMBER_RETRY;
  private NUMBER_DELAY: number = config.NUMBER_DELAY;
  constructor() {}

  async connectChannel(numberPerfetch: number = 50): Promise<amqp.Channel> {
    try {
      if (!this.connection) {
        this.connection = await this.createConnection();
      }

      this.channel = await this.connection.createChannel();

      this.channel.on('error', (err) => {
        this.reconnect(err);
      });

      this.channel.on('close', (err) => {
        this.reconnect(err);
      });

      this.channel.on('disconnect', (err) => {
        this.reconnect(err);
      });

      this.channel.prefetch(numberPerfetch);
      return this.channel;
    } catch (_) {
      await this.connectChannel();
    }
  }

  private async createConnection(): Promise<amqp.Connection> {
    let attempts = 0;

    while (attempts < this.NUMBER_RETRY) {
      try {
        const connection = await amqp.connect(config.RABBIT.URL);
        return connection;
      } catch (_) {
        attempts++;
        if (attempts === this.NUMBER_RETRY) {
          Logger.error(
            `RabbitMQ connection failed after ${this.NUMBER_RETRY} attempts`,
          );
        }
        await this.delay(Math.pow(2, attempts) * this.NUMBER_DELAY);
      }
    }
  }

  private async reconnect(err: Error) {
    if (err && err.message) {
      Logger.error(`RE_CONNECT`, err.message);
    }
    if (!err) {
      await this.connectChannel();
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
