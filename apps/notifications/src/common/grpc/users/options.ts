import { Metadata } from '@grpc/grpc-js';
import { ClientOptions, Transport } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { PackageService } from 'packages/common/constant';
import { config } from 'packages/config';
import { Observable } from 'rxjs';

export interface UserReq {
  userId: number;
}

export interface UserRes {
  status: string;
  message: string;
  data: User;
}

export interface UsersService {
  GetById(request: UserReq, metaData: Metadata): Observable<User>;
}

export const grpcUsersOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: PackageService.USERS,
    protoPath: config.PROTO_PATH.USERS,
    url: config.USERS_GRPC_HOST,
  },
};
