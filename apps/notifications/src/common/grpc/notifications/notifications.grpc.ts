import { Client, ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';
import { Metadata } from '@grpc/grpc-js';
import { config } from 'packages/config';
import { grpcNotiOptions, NotificationsService, SendNotiReq } from './options';

export class NotificationsGRPC {
  private notificationsService: NotificationsService;

  private metadata: Metadata;

  @Client(grpcNotiOptions) private readonly client: ClientGrpc;

  onModuleInit() {
    this.notificationsService = this.client.getService<NotificationsService>(
      'NotificationsService',
    );
    this.metadata = new Metadata();
    this.metadata.add(config.AUTHEN_KEY, config.API_KEY);
  }

  async SendNotification(payload: SendNotiReq): Promise<void> {
    try {
      await firstValueFrom(
        this.notificationsService.sendNotification(payload, this.metadata),
      );
    } catch (error) {
      Logger.error('GRPC_SEND_NOTI', error);
    }
  }
}
