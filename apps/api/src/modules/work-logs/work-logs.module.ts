import { Module } from '@nestjs/common';
import { TasksModule } from '../tasks/tasks.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { WorkLogsController } from './work-logs.controller';
import { WorkLogsService } from './work-logs.service';

/**
 * WorkLogsModule: create/list/delete work log (Daily Work Log).
 * TasksModule untuk reuse otorisasi akses task; RealtimeModule untuk emit
 * event worklog:new.
 */
@Module({
  imports: [TasksModule, RealtimeModule],
  controllers: [WorkLogsController],
  providers: [WorkLogsService],
})
export class WorkLogsModule {}
