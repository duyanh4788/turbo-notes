import { Metadata } from '@grpc/grpc-js';
import { ClientOptions, Transport } from '@nestjs/microservices';
import { PackageService } from 'packages/common/constant';
import { config } from 'packages/config';
import { Observable } from 'rxjs';
export interface CountReq {
  userId: number;
  typeCount: string;
}
export interface CountRes {
  status: string;
  message: string;
}
export interface DecreaseTotalReq {
  totalNotes: number;
  totalNoteDetails: number;
}

export interface UsersService {
  CountNotes(request: CountReq, metaData: Metadata): Observable<void>;
  CountNoteDetails(request: CountReq, metaData: Metadata): Observable<void>;
  DecreaseTotal(
    request: DecreaseTotalReq,
    metaData: Metadata,
  ): Observable<void>;
}

export const grpcUsersOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: PackageService.USERS,
    protoPath: config.PROTO_PATH.USERS,
    url: config.USERS_GRPC_HOST,
  },
};
