import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as classValidator from 'class-validator';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT') ?? 3000;
  app.setGlobalPrefix('api');
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Digis test task API')
    .setDescription('Digis test task API documentation')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validatorPackage: classValidator,
      stopAtFirstError: false,
    }),
  );
  await app.listen(port);
  console.log(`Server run on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/docs`);
}
bootstrap();
