import { Module } from '@nestjs/common';
import { ShareModule } from 'packages/share/modules/module';
import { ElasticsearchModules } from 'packages/share/modules/elastichsearchs.module';
import { controllersProvider } from './provider/controllers.provider';
import { servicesProvider } from './provider/services.provider';
import { UsersGRPC } from './common/grpc/users/users.grpc';

@Module({
  imports: [ShareModule, ElasticsearchModules],
  controllers: [...controllersProvider],
  providers: [...servicesProvider, UsersGRPC],
  exports: [UsersGRPC],
})
export class AppModule {}
