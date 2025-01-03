import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'packages/config';
import { SwaggerService } from 'packages/share/services/swagger.service';
import { ValidationPipe } from '@nestjs/common';
import { SuccessErrorInterceptor } from 'packages/middleware/success-error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(config.NOTES_PATH);
  /** Config Swagger */
  SwaggerService.build(app, config.SWAGGER_NOTES_PATH);

  app.useGlobalInterceptors(new SuccessErrorInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();

  await app.listen(config.NOTES_PORT, () => {
    console.log(`app listen port: ${config.NOTES_PORT}`);
    console.log(
      `view swagger http://localhost:${config.NOTES_PORT}${config.SWAGGER_NOTES_PATH}`,
    );
  });
}
bootstrap();
