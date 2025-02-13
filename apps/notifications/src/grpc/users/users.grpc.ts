import { Client, ClientGrpc } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { Metadata } from '@grpc/grpc-js';
import { config } from 'packages/config';
import { grpcUsersOptions, UsersService } from './options';
import { User } from '@prisma/client';
import { firstValueFrom } from 'rxjs';

export class UsersGRPC {
  private usersService: UsersService;

  private metadata: Metadata;

  @Client(grpcUsersOptions) private readonly client: ClientGrpc;

  onModuleInit() {
    this.usersService = this.client.getService<UsersService>('UsersService');
    this.metadata = new Metadata();
    this.metadata.add(config.AUTHEN_KEY, config.API_KEY);
    Logger.log(`GRPC Client initialized: ${JSON.stringify(this.usersService)}`);
  }

  async GetById(userId: number): Promise<User | null> {
    try {
      return await firstValueFrom(
        this.usersService.GetById({ userId }, this.metadata),
      );
    } catch (error) {
      Logger.error('GRPC_GET_BY_ID', error);
    }
  }
}
