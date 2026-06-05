import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: izinkan frontend (CORS_ORIGINS, default http://localhost:3000)
  // mengakses API dari browser. credentials true untuk dukungan cookie/Bearer.
  app.enableCors({
    origin: (process.env.CORS_ORIGINS ?? 'http://localhost:3000').split(','),
    credentials: true,
  });

  // Prefix global: semua route diawali /api (mis. /api/auth/login)
  app.setGlobalPrefix('api');

  // ValidationPipe global: jalankan validasi class-validator di semua DTO.
  // whitelist + forbidNonWhitelisted membuang/menolak field tak dikenal.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
