import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const SWAGGER_TITLE = process.env.SWAGGER_TITLE || 'Exam';
const SWAGGER_DESCRIPTION =
  process.env.SWAGGER_DESCRIPTION || 'Some description';
const APP_PREFIX = process.env.APP_PREFIX || 'api/v';
const ENABLE_SWAGGER = process.env.ENABLE_SWAGGER || false;
const API_VERSION = process.env.API_VERSION || '1'

function createSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion(API_VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${APP_PREFIX}${API_VERSION}/documentation`, app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: APP_PREFIX,
    defaultVersion: API_VERSION,
  });

  if (ENABLE_SWAGGER) {
    createSwagger(app);
  }

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
