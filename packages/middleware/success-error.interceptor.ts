import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { TypeResponse } from 'packages/common/constant';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class SuccessErrorInterceptor implements NestInterceptor {
    intercept(_: ExecutionContext, next: CallHandler): Observable<any> {

        return next.handle().pipe(
            map((data) => {
                return {
                    status: TypeResponse.SUCCESS,
                    code: HttpStatus.OK,
                    data: data,
                    message: 'Successfully',
                }
            }),
            catchError((err) => {
                throw err;
            }),
        );
    }
}
