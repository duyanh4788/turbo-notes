import { Client, ClientGrpc } from '@nestjs/microservices';
import { TypeCount } from 'packages/common/constant';
import { firstValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';
import { Metadata } from '@grpc/grpc-js';
import { config } from 'packages/config';
import { grpcUsersOptions, UsersService } from './options';

export class UsersGRPC {
  private usersService: UsersService;

  private metadata: Metadata;

  @Client(grpcUsersOptions) private readonly client: ClientGrpc;

  onModuleInit() {
    this.usersService = this.client.getService<UsersService>('UsersService');
    this.metadata = new Metadata();
    this.metadata.add(config.AUTHEN_KEY, config.API_KEY);
  }

  async CountNotes(userId: number, typeCount: TypeCount): Promise<void> {
    try {
      await firstValueFrom(
        this.usersService.CountNotes({ userId, typeCount }, this.metadata),
      );
    } catch (error) {
      Logger.error('GRPC_COUNT_NOTES', error);
    }
  }

  async CountNoteDetails(userId: number, typeCount: TypeCount): Promise<void> {
    try {
      await firstValueFrom(
        this.usersService.CountNoteDetails(
          { userId, typeCount },
          this.metadata,
        ),
      );
    } catch (error) {
      Logger.error('GRPC_COUNT_NOTE_DETAILS', error);
    }
  }
}
