import { Global, Module } from '@nestjs/common';
import { RedisService } from 'packages/share/services/redis.service';
import { AuthMiddleware } from 'packages/middleware/auth.middleware';
import { ApiKeyMiddleware } from 'packages/middleware/apiKey.middleware';
import { GrpcInterceptor } from 'packages/middleware/grpc.interceptor';
import { PrismaModule } from './prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [RedisService, AuthMiddleware, ApiKeyMiddleware, GrpcInterceptor],
  exports: [RedisService, AuthMiddleware, ApiKeyMiddleware, GrpcInterceptor],
})
export class ShareModule {}
