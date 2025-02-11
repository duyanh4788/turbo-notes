import { Module } from '@nestjs/common';
import { ShareModule } from 'packages/share/modules/module';
import { ElasticsearchModules } from 'packages/share/modules/elastichsearchs.module';
import { controllersProvider } from './provider/controllers.provider';
import { servicesProvider } from './provider/services.provider';

@Module({
  imports: [ShareModule, ElasticsearchModules],
  controllers: [...controllersProvider],
  providers: [...servicesProvider],
  exports: [],
})
export class AppModule {}
