import { Module } from '@nestjs/common';
import { KpiController } from './kpi.controller';
import { KpiService } from './kpi.service';

/**
 * KpiModule: KPI operasional dihitung dinamis dari data yang sudah ada
 * (PrismaModule global). Tanpa tabel/score tersimpan, tanpa realtime/notif.
 */
@Module({
  controllers: [KpiController],
  providers: [KpiService],
})
export class KpiModule {}
