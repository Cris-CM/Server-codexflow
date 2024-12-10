import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  // Configura la carpeta de archivos estáticos
  app.use('/Client', express.static(join(__dirname, '..', 'Client')));

  await app.listen(3000);
}
bootstrap();
