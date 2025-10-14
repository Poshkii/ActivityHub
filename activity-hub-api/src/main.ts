import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // Swagger setup
  const { SwaggerModule, DocumentBuilder } = await import('@nestjs/swagger');
  const config = new DocumentBuilder()
    .setTitle('ActivityHub API')
    .setDescription('API documentation for ActivityHub')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // data validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // removes properties that arent in dto       
    transform: true, // auto transform to dto      
    forbidNonWhitelisted: true, // throw error if non dto property detected
  }));

  await app.listen(process.env.PORT || 8000);
  console.log(`Application is running on: http://localhost:${process.env.PORT || 8000}`);
}
bootstrap();
