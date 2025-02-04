import { Module } from '@nestjs/common';
import { ShareModule } from 'packages/share/modules/module';
import { ElasticsearchModules } from 'packages/share/modules/elastichsearchs.module';
import { controllersProvider } from './provider/controllers.provider';
import { servicesProvider } from './provider/services.provider';
import { repositoryProvider } from './provider/repository.provider';
import { UsersGRPC } from './common/grpc/users/users.grpc';
import { NotificationsGRPC } from './common/grpc/notifications/notifications.grpc';

@Module({
  imports: [ShareModule, ElasticsearchModules],
  controllers: [...controllersProvider],
  providers: [
    ...servicesProvider,
    ...repositoryProvider,
    UsersGRPC,
    NotificationsGRPC,
  ],
  exports: [UsersGRPC, NotificationsGRPC],
})
export class AppModule {}
