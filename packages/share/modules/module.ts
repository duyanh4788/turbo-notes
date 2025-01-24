import { Global, Module } from '@nestjs/common';
import { RedisService } from 'packages/share/services/redis.service';
import { AuthMiddleware } from 'packages/middleware/auth.middleware';
import { ApiKeyMiddleware } from 'packages/middleware/apiKey.middleware';
import { GrpcInterceptor } from 'packages/middleware/grpc.interceptor';
import { PrismaService } from '../services/prisma.service';

@Global()
@Module({
  imports: [],
  providers: [RedisService, PrismaService, AuthMiddleware, ApiKeyMiddleware, GrpcInterceptor],
  exports: [RedisService, PrismaService, AuthMiddleware, ApiKeyMiddleware, GrpcInterceptor],
})
export class ShareModule {}
