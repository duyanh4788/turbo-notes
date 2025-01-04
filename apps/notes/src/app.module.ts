import { Module } from '@nestjs/common';
import { ShareModule } from 'packages/share/modules/module';
import { controllersProvider } from './provider/controllers.provider';
import { servicesProvider } from './provider/services.provider';
import { repositoryProvider } from './provider/repository.provider';

@Module({
  imports: [ShareModule],
  controllers: [...controllersProvider],
  providers: [...servicesProvider, ...repositoryProvider],
})
export class AppModule {}
