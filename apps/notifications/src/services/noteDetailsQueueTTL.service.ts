import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Channel } from 'amqplib';
import { RedisService } from 'packages/share/services/redis.service';
import { NoteDetails } from '@prisma/client';
import { Helper } from 'packages/utils/helper';
import { NodeMailerService } from './nodeMailer.service';
import {
  ExchangeRabbit,
  KeyRedis,
  OperationPSQL,
} from 'packages/common/constant';
import { RabbitService } from 'packages/share/services/rabbit.service';
@Injectable()
export class NoteDetailQueueTTLService implements OnModuleInit {
  private channel: Channel;
  constructor(
    private rabbit: RabbitService,
    private redis: RedisService,
    private nodeMailerService: NodeMailerService,
  ) {}

  async onModuleInit() {
    await this.connectChannel();
    await this.ConsumerQueueDelay();
  }

  async PublishQueueDelay(body: NoteDetails, operation: OperationPSQL) {
    const delayQueue = `${ExchangeRabbit.SCHEDULE_DELAY_QUEUE}_${body.id}`;
    const mainKey = `${KeyRedis.NOTEDETAIL_SCHEDULE}_${body.id}`;
    if (operation === OperationPSQL.DELETE && body.id) {
      await this.deleteQueue(delayQueue, mainKey);
      return;
    }
    const isProcessed = await this.markScheduleId(mainKey);
    if (isProcessed) {
      await this.deleteQueue(delayQueue, mainKey);
    }
    const timeCurrent = new Date().getTime();
    const scheduleTime = new Date(body.scheduleTime).getTime();
    const delayTime = scheduleTime - timeCurrent;
    if (delayTime < 1000 && delayTime > 0) {
      await this.nodeMailerService.sendSchedule(body);
      await this.redis._del(mainKey);
      return;
    }

    try {
      await this.assertExchange();
      await this.channel.assertQueue(delayQueue, {
        durable: true,
        arguments: {
          'x-message-ttl': delayTime, // DelayTime
          'x-dead-letter-exchange': ExchangeRabbit.SCHEDULE_MAIN_EX, // After TTL, move to SCHEDULE_MAIN_EX
          'x-dead-letter-routing-key': ExchangeRabbit.SCHEDULE_MAIN_QUEUE, // Route to SCHEDULE_MAIN_QUEUE
        },
      });
      await this.channel.bindQueue(
        delayQueue,
        ExchangeRabbit.SCHEDULE_DELAY_EX,
        ExchangeRabbit.SCHEDULE_DELAY,
      );
      await this.bindMainQueue();
      this.channel.publish(
        ExchangeRabbit.SCHEDULE_DELAY_EX,
        ExchangeRabbit.SCHEDULE_DELAY,
        Buffer.from(JSON.stringify(body)),
      );
    } catch (error) {
      Logger.error('ERROR_IN_PUBLISHQUEUEEXEC', error);
      if (error.message.includes('Channel closed')) {
        await this.connectChannel();
      }
    }
  }

  private async ConsumerQueueDelay() {
    await this.channel.assertQueue(ExchangeRabbit.SCHEDULE_MAIN_QUEUE);
    this.channel.consume(ExchangeRabbit.SCHEDULE_MAIN_QUEUE, async (msg) => {
      if (msg !== null) {
        try {
          const payload: NoteDetails = Helper.parseJson(msg.content.toString());
          const content: string = await this.redis._getString(
            `${KeyRedis.CONTENT_NOTE_DETAIL}_${payload.id}`,
          );
          if (!content) {
            throw new Error(`EMPTY_CONTENT_${payload.id}`);
          }
          payload.content = content;
          const delayQueue = `${ExchangeRabbit.SCHEDULE_DELAY_QUEUE}_${payload.id}`;
          const mainKey = `${KeyRedis.NOTEDETAIL_SCHEDULE}_${payload.id}`;
          const isProcessed = await this.markScheduleId(delayQueue);
          if (isProcessed) {
            this.channel.ack(msg);
            return;
          }
          await this.nodeMailerService.sendSchedule(payload);
          this.channel.ack(msg);
          await this.channel.deleteQueue(delayQueue);
          await this.redis._del(delayQueue);
          await this.redis._del(mainKey);
        } catch (_) {
          this.channel.nack(msg, false, true);
        }
      }
    });
  }

  private async connectChannel(): Promise<void> {
    this.channel = await this.rabbit.connectChannel();
  }

  private async markScheduleId(key: string): Promise<boolean> {
    const isIdExist = await this.redis._setNx(key);
    return isIdExist !== 1;
  }

  private async deleteQueue(queue: string, mainKey: string) {
    try {
      await this.channel.deleteQueue(queue, {
        ifUnused: false,
        ifEmpty: false,
      });
      await this.redis._del(mainKey);
    } catch (error) {
      Logger.error(error);
    }
  }

  private async assertExchange() {
    // Confirm that the exchange already exists, no need to recreate it every delayTime
    await this.channel.assertExchange(
      ExchangeRabbit.SCHEDULE_MAIN_EX,
      'direct',
      { durable: true },
    );
    await this.channel.assertExchange(
      ExchangeRabbit.SCHEDULE_DELAY_EX,
      'direct',
      { durable: true },
    );
  }

  private async bindMainQueue() {
    await this.channel.assertQueue(ExchangeRabbit.SCHEDULE_MAIN_QUEUE, {
      durable: true,
    });
    await this.channel.bindQueue(
      ExchangeRabbit.SCHEDULE_MAIN_QUEUE,
      ExchangeRabbit.SCHEDULE_MAIN_EX,
      ExchangeRabbit.SCHEDULE_MAIN_QUEUE,
    );
  }
}
