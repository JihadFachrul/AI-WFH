import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

/**
 * CalendarModule (6.2). Reuse NotificationsService (New Calendar Event) &
 * RealtimeService (calendar:event-created/updated/deleted). Menggabungkan
 * Meeting (6.1, read-only) + CalendarEvent. Tanpa sync eksternal / reminder.
 */
@Module({
  imports: [NotificationsModule, RealtimeModule],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
