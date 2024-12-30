import { Global, Module } from '@nestjs/common';
import { RedisService } from 'packages/share/services/redis.service';
import { PrismaService } from '../services/prisma.service';
import { AuthMiddleware } from 'packages/middleware/auth.middleware';

@Global()
@Module({
  imports: [],
  providers: [RedisService, PrismaService],
  exports: [RedisService, PrismaService],
})
export class ShareModule { }
