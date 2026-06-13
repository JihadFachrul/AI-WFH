import { Module } from '@nestjs/common';
import { TasksModule } from '../tasks/tasks.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { TaskReviewsController } from './task-reviews.controller';
import { TaskReviewsService } from './task-reviews.service';

/**
 * TaskReviewsModule: submit-review, create review, review history.
 * Reuse TasksService (akses + status), NotificationsService, RealtimeService.
 */
@Module({
  imports: [TasksModule, NotificationsModule, RealtimeModule],
  controllers: [TaskReviewsController],
  providers: [TaskReviewsService],
})
export class TaskReviewsModule {}
