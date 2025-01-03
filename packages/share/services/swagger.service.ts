import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerService {
  static build(app: INestApplication, pathUrl: string) {
    const options = new DocumentBuilder()
      .setTitle('Api document')
      .setDescription('The API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(pathUrl, app, document, {
      jsonDocumentUrl: 'swagger/json',
      explorer: true,
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
      },
    });
  }
}
