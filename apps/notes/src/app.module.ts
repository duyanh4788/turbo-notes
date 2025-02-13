import { Module } from '@nestjs/common';
import { ShareModule } from 'packages/share/modules/module';
import { ElasticsearchModules } from 'packages/share/modules/elastichsearchs.module';
import { controllersProvider } from './provider/controllers.provider';
import { servicesProvider } from './provider/services.provider';
import { repositoryProvider } from './provider/repository.provider';
import { UsersGRPC } from './grpc/users/users.grpc';

@Module({
  imports: [ShareModule, ElasticsearchModules],
  controllers: [...controllersProvider],
  providers: [...servicesProvider, ...repositoryProvider, UsersGRPC],
  exports: [UsersGRPC],
})
export class AppModule {}
