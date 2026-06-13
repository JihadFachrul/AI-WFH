import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { TasksService } from '../tasks/tasks.service';
import { CreateTaskEvidenceDto } from './dto/create-task-evidence.dto';
import { EVIDENCE_URL_PREFIX } from './task-evidence.storage';

const ADMIN_ROLES: UserRole[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

/** Field evidence + uploader yang dikembalikan (no overfetch). */
const EVIDENCE_SELECT = {
  id: true,
  taskId: true,
  uploadedById: true,
  fileName: true,
  fileUrl: true,
  fileType: true,
  fileSize: true,
  description: true,
  createdAt: true,
  uploadedBy: { select: { id: true, name: true, email: true } },
} satisfies Prisma.TaskEvidenceSelect;

@Injectable()
export class TaskEvidenceService {
  private readonly logger = new Logger(TaskEvidenceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tasksService: TasksService,
  ) {}

  /**
   * Upload evidence. assertTaskAccess memastikan requester berhak melihat task
   * (EMPLOYEE harus pemilik). Upload sendiri hanya untuk assignee atau admin
   * (MANAGER non-assignee hanya boleh melihat, sesuai spec).
   */
  async uploadEvidence(
    taskId: string,
    requester: AuthUser,
    file: Express.Multer.File | undefined,
    dto: CreateTaskEvidenceDto,
  ) {
    if (!file) {
      throw new BadRequestException('File evidence wajib diunggah');
    }

    const task = await this.tasksService.assertTaskAccess(taskId, requester);
    const canContribute =
      this.isAdmin(requester) || task.assigneeId === requester.id;
    if (!canContribute) {
      throw new ForbiddenException(
        'Hanya pemilik task atau admin yang dapat mengunggah evidence',
      );
    }

    return this.prisma.taskEvidence.create({
      data: {
        taskId,
        uploadedById: requester.id,
        fileName: file.originalname,
        fileUrl: `${EVIDENCE_URL_PREFIX}/${file.filename}`,
        fileType: file.mimetype,
        fileSize: file.size,
        description: dto.description,
      },
      select: EVIDENCE_SELECT,
    });
  }

  /** List evidence sebuah task (siapa pun yang boleh melihat task). */
  async getTaskEvidence(taskId: string, requester: AuthUser) {
    await this.tasksService.assertTaskAccess(taskId, requester);
    return this.prisma.taskEvidence.findMany({
      where: { taskId },
      select: EVIDENCE_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Hapus evidence: hanya uploader atau ADMIN/SUPER_ADMIN. File di-unlink. */
  async deleteEvidence(
    taskId: string,
    evidenceId: string,
    requester: AuthUser,
  ): Promise<{ id: string; deleted: true }> {
    await this.tasksService.assertTaskAccess(taskId, requester);

    const evidence = await this.prisma.taskEvidence.findFirst({
      where: { id: evidenceId, taskId },
      select: { id: true, uploadedById: true, fileUrl: true },
    });
    if (!evidence) {
      throw new NotFoundException('Evidence tidak ditemukan');
    }

    const canDelete =
      this.isAdmin(requester) || evidence.uploadedById === requester.id;
    if (!canDelete) {
      throw new ForbiddenException(
        'Hanya pengunggah atau admin yang dapat menghapus evidence',
      );
    }

    await this.prisma.taskEvidence.delete({ where: { id: evidence.id } });

    // Best-effort hapus file fisik (kegagalan tidak menggagalkan operasi).
    try {
      await unlink(join(process.cwd(), evidence.fileUrl));
    } catch (error) {
      this.logger.warn(
        `Gagal menghapus file ${evidence.fileUrl}: ${
          error instanceof Error ? error.message : 'unknown'
        }`,
      );
    }

    return { id: evidence.id, deleted: true };
  }

  /** Update completion note — didelegasikan ke TasksService (Task write). */
  updateCompletionNote(taskId: string, note: string, requester: AuthUser) {
    return this.tasksService.setCompletionNote(taskId, note ?? '', requester);
  }

  private isAdmin(requester: AuthUser): boolean {
    return ADMIN_ROLES.includes(requester.role as UserRole);
  }
}
