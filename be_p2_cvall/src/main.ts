import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  //versionamiento
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableCors();

  //Swagger
  const config = new DocumentBuilder()
    .setTitle('API Rest Parcial2-SIS257')
    .setDescription('API Rest de la materia Desarrollo de App Int/Internet II')
    .setVersion('1.0')
    .addTag('series')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, document);

  await app.listen(process.env.PORT);
  console.log(`App corriendo ${await app.getUrl()}/apidoc`);
}
bootstrap();