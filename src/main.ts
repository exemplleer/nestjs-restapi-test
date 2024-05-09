import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const port = process.env.PORT || 5001;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const document = new DocumentBuilder()
    .setTitle('Event App')
    .setDescription('Event App Docs')
    .setVersion('0.1')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('/docs', app, swaggerDocument);

  await app.listen(port, () =>
    Logger.log(`Server start on port ${port}`, 'Bootstrap'),
  );
}
bootstrap();
