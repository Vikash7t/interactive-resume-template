import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module.js';

dotenv.config();

async function bootstrap() {
  const logger = new Logger('ResuCraftBootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error'],
  });

  // OWASP A05: Security headers via Helmet
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  // OWASP A01: Strict CORS policy
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  app.enableCors({
    origin: [corsOrigin, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // OWASP A03 / A08: Global validation & sanitization
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  // Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('ResuCraft AI API')
    .setDescription('Enterprise-grade ATS Resume Engine Backend Service')
    .setVersion('1.0.0')
    .addTag('Health & Monitoring')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`ResuCraft API service is running on http://localhost:${port}/api`);
  logger.log(`Swagger OpenAPI documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
