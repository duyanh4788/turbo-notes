import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { config } from 'packages/config';

@Injectable()
export class ApiKeyMiddleware {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers[config.AUTHEN_KEY];
    if (apiKey === config.API_KEY) return true;
    throw new UnauthorizedException();
  }
}
