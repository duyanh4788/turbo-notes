import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'packages/config';
import { SwaggerService } from 'packages/share/services/swagger.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SuccessErrorInterceptor } from 'packages/middleware/success-error.interceptor';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PackageService } from 'packages/common/constant';

console.log(config.PROTO_PATH.USERS);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(config.USERS_PATH);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: PackageService.USERS,
      protoPath: config.PROTO_PATH.USERS,
      url: config.USERS_GRPC_HOST,
    },
  });

  /** Config Swagger */
  SwaggerService.build(app, config.SWAGGER_USERS_PATH);

  app.useGlobalInterceptors(new SuccessErrorInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();

  await app.startAllMicroservices();
  await app.listen(config.USERS_PORT, () => {
    Logger.log(`app users is listening on port: ${config.USERS_PORT}`);
    Logger.log(
      `view swagger http://localhost:${config.USERS_PORT}${config.SWAGGER_USERS_PATH}`,
    );
  });
}
bootstrap();
