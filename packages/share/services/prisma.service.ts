import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      Logger.log('Connected to Prisma');
    } catch (error) {
      Logger.error('Failed to connect to Prisma:', error.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    Logger.log('Disconnected from Prisma');
  }
}
