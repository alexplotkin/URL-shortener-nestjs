import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = await app.get(ConfigService);
  const PORT = configService.get<string>('port') || 8080;

  const options = new DocumentBuilder()
    .setTitle('URL Shortener API docs')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app
    .listen(PORT, '0.0.0.0')
    .then(async () =>
      console.log(`Application is running on: ${await app.getUrl()}`),
    );
}
bootstrap();
