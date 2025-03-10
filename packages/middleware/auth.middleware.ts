import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthHeaders, KeyRedis } from 'packages/common/constant';
import { config } from 'packages/config';
import * as crypto from 'crypto';
import { User } from '@prisma/client';
import { PrismaService } from 'packages/share/services/prisma.service';
import { RedisService } from 'packages/share/services/redis.service';

@Injectable()
export class AuthMiddleware {
  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redis: RedisService,
    // eslint-disable-next-line no-useless-constructor, no-empty-function
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const request = context.switchToHttp().getRequest();
    const authHeaders = request.headers.authorization;
    const userId = Number(request.headers.userid);
    if (!authHeaders) {
      const xApiKey = req.headers[AuthHeaders.API_KEY];
      if (!xApiKey || xApiKey !== config.API_KEY) throw new UnauthorizedException();
      request.user = AuthHeaders.SEVER_PROCESS;
      return request.user;
    }
    if (!userId) {
      throw new UnauthorizedException();
    }
    const idToken = authHeaders.split(' ')[1];
    const decoded = await this.decodeToken(userId, idToken);
    request.user = decoded;
    return request.user;
  }

  private async decodeToken(userId: number, token: string): Promise<User> {
    try {
      const [header, payload, signature] = token.split('.');
      const key = `${KeyRedis.USER}_${userId}`;
      let user: User = await this.redis._get(key);

      if (!user) {
        user = await this.prismaService.user.findUnique({
          where: { id: userId },
        });
        if (user) {
          await this.redis._set(key, user);
        }
      }

      if (!user) {
        throw new UnauthorizedException();
      }

      const expectedSignature = crypto
        .createHmac('sha256', user.tokenGg)
        .update(`${header}.${payload}`)
        .digest('base64url');

      if (signature !== expectedSignature) {
        throw new UnauthorizedException();
      }
      delete user.tokenGg;
      return user;
    } catch (_) {
      throw new UnauthorizedException();
    }
  }
}
