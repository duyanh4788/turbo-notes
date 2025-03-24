import { Global, Module } from '@nestjs/common';
import { RedisService } from 'packages/share/services/redis.service';
import { AuthMiddleware } from 'packages/middleware/auth.middleware';
import { ApiKeyMiddleware } from 'packages/middleware/apiKey.middleware';
import { GrpcInterceptor } from 'packages/middleware/grpc.interceptor';
import { RabbitService } from '../services/rabbit.service';
import { PrismaService } from '../services/prisma.service';

@Global()
@Module({
  imports: [],
  providers: [
    RedisService,
    PrismaService,
    RabbitService,
    AuthMiddleware,
    ApiKeyMiddleware,
    GrpcInterceptor,
  ],
  exports: [
    RedisService,
    PrismaService,
    RabbitService,
    AuthMiddleware,
    ApiKeyMiddleware,
    GrpcInterceptor,
  ],
})
export class ShareModule {}
