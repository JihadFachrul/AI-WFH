import { Module } from '@nestjs/common';
import { TasksModule } from '../tasks/tasks.module';
import { TaskEvidenceController } from './task-evidence.controller';
import { TaskEvidenceService } from './task-evidence.service';

/**
 * TaskEvidenceModule: upload/list/delete evidence + completion note.
 * Mengimpor TasksModule untuk reuse otorisasi akses task (TasksService).
 */
@Module({
  imports: [TasksModule],
  controllers: [TaskEvidenceController],
  providers: [TaskEvidenceService],
})
export class TaskEvidenceModule {}
