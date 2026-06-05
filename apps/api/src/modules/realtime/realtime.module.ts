import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RealtimeGateway } from './realtime.gateway';
import { RealtimeService } from './realtime.service';

/**
 * RealtimeModule menyediakan RealtimeService (di-export agar modul lain
 * seperti Notifications & Tasks bisa memicu emit realtime).
 * JwtModule didaftarkan di sini untuk verifikasi token saat koneksi socket
 * (secret dari env, sama sumbernya dengan AuthModule).
 */
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  providers: [RealtimeGateway, RealtimeService],
  exports: [RealtimeService],
})
export class RealtimeModule {}
