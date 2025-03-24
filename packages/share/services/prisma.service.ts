import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['error', 'warn'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    Logger.log('Connected to Prisma');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    Logger.log('Disconnected from Prisma');
  }
}
