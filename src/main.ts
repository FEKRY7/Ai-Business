import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, 
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('AI WhatsApp Chatbot API')
    .setDescription('API documentation for AI WhatsApp Chatbot')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);


  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);

  console.log(`🚀 Server running on http://localhost:3000`);
}
bootstrap();

// npm run start:dev   
// https://chatgpt.com/c/6a6672a8-b624-83ea-a4b6-d70cd05b2266
// دلوقتي المشروع خلص عاوزك تراجع علي كود فرجت ورسيت بسورد و تعمل تست لكو كلو و نعمل ريد مي احترافي
