import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { TaskEvidenceService } from './task-evidence.service';
import { CreateTaskEvidenceDto } from './dto/create-task-evidence.dto';
import { CompletionNoteDto } from './dto/completion-note.dto';
import {
  evidenceMulterStorage,
  EVIDENCE_MAX_BYTES,
} from './task-evidence.storage';

/**
 * Endpoint Work Evidence di bawah task. Controller hanya request/response;
 * otorisasi & logic di service.
 */
@Controller('tasks/:taskId')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskEvidenceController {
  constructor(private readonly evidenceService: TaskEvidenceService) {}

  /** POST /api/tasks/:taskId/evidence (multipart: file + description). */
  @Post('evidence')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: evidenceMulterStorage,
      limits: { fileSize: EVIDENCE_MAX_BYTES },
    }),
  )
  upload(
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateTaskEvidenceDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.evidenceService.uploadEvidence(taskId, user, file, dto);
  }

  /** GET /api/tasks/:taskId/evidence */
  @Get('evidence')
  list(
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.evidenceService.getTaskEvidence(taskId, user);
  }

  /** DELETE /api/tasks/:taskId/evidence/:evidenceId */
  @Delete('evidence/:evidenceId')
  remove(
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string,
    @Param('evidenceId', new ParseUUIDPipe({ version: '4' }))
    evidenceId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.evidenceService.deleteEvidence(taskId, evidenceId, user);
  }

  /** PATCH /api/tasks/:taskId/completion-note */
  @Patch('completion-note')
  completionNote(
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string,
    @Body() dto: CompletionNoteDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.evidenceService.updateCompletionNote(
      taskId,
      dto.completionNote ?? '',
      user,
    );
  }
}
