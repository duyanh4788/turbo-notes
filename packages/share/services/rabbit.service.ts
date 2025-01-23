import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { config } from 'packages/config';

@Injectable()
export class RabbitService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection | null = null;

  private channel: amqp.Channel | null = null;

  private readonly RABBITMQ_URL = config.RABBIT.URL;

  private readonly TIMER: number = 1000;

  async onModuleInit(): Promise<void> {
    await this.connectChannel();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  async connectChannel(numberPerfetch: number = 50): Promise<amqp.Channel | null> {
    try {
      if (!this.connection) {
        this.connection = await this.createConnection();
      }

      if (!this.connection) {
        Logger.error('Connection failed.');
        return null;
      }

      this.channel = await this.connection.createChannel();

      this.channel.on('error', (err) => this.reconnect(err));
      this.channel.on('close', (err) => this.reconnect(err));
      this.channel.on('disconnect', (err) => this.reconnect(err));

      this.channel.prefetch(numberPerfetch);
      return this.channel;
    } catch (error) {
      Logger.error('Error in connectChannel:', error.message);
      return this.connectChannel(); // Retry connection
    }
  }

  private async createConnection(): Promise<amqp.Connection | null> {
    const maxRetries = 5;
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        const connection = await amqp.connect(this.RABBITMQ_URL);
        return connection;
      } catch (error) {
        attempts++;
        Logger.error(`Connection attempt ${attempts} failed: ${error.message}`);
        await this.delay(2 ** attempts * this.TIMER);
      }
    }

    Logger.error('Max retries reached for creating RabbitMQ connection');
    return null;
  }

  private async reconnect(err: Error): Promise<void> {
    if (err && err.message) {
      Logger.error('RE_CONNECT:', err.message);
    }
    // Only reconnect if there is no error or retry connection
    if (!err) {
      await this.connectChannel();
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async disconnect() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      Logger.log('RabbitMQ connection closed.');
    } catch (error) {
      Logger.error('Error while closing RabbitMQ connection:', error.message);
    }
  }
}
