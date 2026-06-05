import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { RealtimeModule } from '../realtime/realtime.module';

/**
 * NotificationsModule meng-export NotificationsService agar TasksModule
 * (TasksService & TaskCommentsService) bisa memicu notifikasi otomatis.
 * RealtimeModule diimpor agar notifikasi baru bisa di-push via WebSocket.
 */
@Module({
  imports: [RealtimeModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
