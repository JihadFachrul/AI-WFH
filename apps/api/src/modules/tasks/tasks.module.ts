import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskCommentsService } from '../task-comments/task-comments.service';
import { TaskCommentsController } from '../task-comments/task-comments.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { RealtimeModule } from '../realtime/realtime.module';

/**
 * TasksModule menampung task CRUD dan task comments. TaskCommentsService
 * meng-inject TasksService untuk reuse otorisasi akses task.
 * NotificationsModule + RealtimeModule diimpor agar service di sini bisa
 * memicu notifikasi dan emit realtime.
 */
@Module({
  imports: [NotificationsModule, RealtimeModule],
  controllers: [TasksController, TaskCommentsController],
  providers: [TasksService, TaskCommentsService],
  exports: [TasksService],
})
export class TasksModule {}
