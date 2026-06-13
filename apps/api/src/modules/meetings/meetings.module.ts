import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';

/**
 * MeetingsModule (6.1). Reuse NotificationsService (undangan) & RealtimeService
 * (meeting:created/updated/deleted). Tanpa video conference / reminder terjadwal.
 */
@Module({
  imports: [NotificationsModule, RealtimeModule],
  controllers: [MeetingsController],
  providers: [MeetingsService],
})
export class MeetingsModule {}
