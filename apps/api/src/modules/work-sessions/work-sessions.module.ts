import { Module } from '@nestjs/common';
import { RealtimeModule } from '../realtime/realtime.module';
import { WorkSessionsController } from './work-sessions.controller';
import { WorkSessionsService } from './work-sessions.service';

/**
 * WorkSessionsModule: start/end/me/team. Reuse RealtimeService untuk
 * broadcast presence (session:started / session:ended).
 */
@Module({
  imports: [RealtimeModule],
  controllers: [WorkSessionsController],
  providers: [WorkSessionsService],
})
export class WorkSessionsModule {}
