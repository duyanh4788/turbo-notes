import { NestFactory } from '@nestjs/core';
import { SwaggerService } from 'packages/share/services/swagger.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SuccessErrorInterceptor } from 'packages/middleware/success-error.interceptor';
import { config } from 'packages/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(config.NOTI_PATH);
  /** Config Swagger */
  SwaggerService.build(app, config.SWAGGER_NOTI_PATH);

  app.useGlobalInterceptors(new SuccessErrorInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();

  await app.listen(config.NOTI_PORT, () => {
    Logger.log(`App Notes listen port: ${config.NOTI_PORT}`);
    Logger.log(
      `View swagger http://localhost:${config.NOTI_PORT}${config.SWAGGER_NOTI_PATH}`,
    );
  });
}
bootstrap();
