import { Metadata } from '@grpc/grpc-js';
import { ClientOptions, Transport } from '@nestjs/microservices';
import { PackageService } from 'packages/common/constant';
import { config } from 'packages/config';
import { Observable } from 'rxjs';

export interface SendNotiReq {
  noteDetailId: number;
  scheduleTime: string;
  title: string;
  content: string;
  email: string;
  userName: string;
}

export interface SendNotiRes {
  status: string;
  message: string;
}

export interface NotificationsService {
  sendNotification(request: SendNotiReq, metaData: Metadata): Observable<void>;
}

export const grpcNotiOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: PackageService.NOTIFICATIONS,
    protoPath: config.PROTO_PATH.NOTI,
    url: config.NOTI_GRPC_HOST,
  },
};
