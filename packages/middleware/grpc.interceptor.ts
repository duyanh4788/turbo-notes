import {
  Injectable,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { config } from 'packages/config';

@Injectable()
export class GrpcInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const grpcContext = context.switchToRpc().getContext();

    const keys = [...grpcContext.internalRepr.keys()];
    const values = [...grpcContext.internalRepr.values()].map((val) => val[0]);

    const hasKey = keys.includes(config.AUTHEN_KEY);
    const hasValue = values.includes(config.API_KEY);

    if (!hasKey || !hasValue) {
      throw new UnauthorizedException();
    }

    return next.handle();
  }
}
