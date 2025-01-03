import { Module } from '@nestjs/common';
import { controllersProvider } from './provider/controllers.provider';
import { servicesProvider } from './provider/services.provider';
import { ShareModule } from 'packages/share/modules/module';
import { repositoryProvider } from './provider/repository.provider';
import { PassportModule } from '@nestjs/passport';
import { GoogleAuthGuard } from './middleware/google-auth-guard.service';
import { GoogleStrategy } from './services/google-strategy.service';

@Module({
  imports: [ShareModule, PassportModule],
  controllers: [...controllersProvider],
  providers: [
    ...servicesProvider,
    ...repositoryProvider,
    GoogleAuthGuard,
    GoogleStrategy,
  ],
})
export class AppModule {}
