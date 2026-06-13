import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { TasksService } from '../tasks/tasks.service';
import { RealtimeService } from '../realtime/realtime.service';
import { CreateWorkLogDto } from './dto/create-work-log.dto';

const ADMIN_ROLES: UserRole[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

/** Field work log + user yang dikembalikan (no overfetch). */
const WORK_LOG_SELECT = {
  id: true,
  taskId: true,
  userId: true,
  activity: true,
  progress: true,
  blocker: true,
  createdAt: true,
  user: { select: { id: true, name: true, email: true } },
} satisfies Prisma.WorkLogSelect;

@Injectable()
export class WorkLogsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tasksService: TasksService,
    private readonly realtime: RealtimeService,
  ) {}

  /**
   * Buat work log. assertTaskAccess memastikan requester boleh melihat task
   * (EMPLOYEE harus pemilik). Mencatat log = assignee atau admin
   * (EMPLOYEE tidak boleh mencatat di task orang lain).
   */
  async create(taskId: string, requester: AuthUser, dto: CreateWorkLogDto) {
    const task = await this.tasksService.assertTaskAccess(taskId, requester);

    const canLog =
      this.isAdmin(requester) || task.assigneeId === requester.id;
    if (!canLog) {
      throw new ForbiddenException(
        'Hanya pemilik task atau admin yang dapat mencatat progress',
      );
    }

    // Lock: jika progress terakhir sudah 100%, task dianggap selesai.
    const latest = await this.prisma.workLog.findFirst({
      where: { taskId },
      orderBy: { createdAt: 'desc' },
      select: { progress: true },
    });
    if (latest?.progress === 100) {
      throw new ConflictException(
        'Progress sudah 100%. Tidak dapat menambah progress baru.',
      );
    }

    const workLog = await this.prisma.workLog.create({
      data: {
        taskId,
        userId: requester.id,
        activity: dto.activity,
        progress: dto.progress,
        blocker: dto.blocker,
      },
      select: WORK_LOG_SELECT,
    });

    // Realtime: beri tahu stakeholder (assignee & creator), kecuali pencatat.
    const recipients = [task.assigneeId, task.creatorId].filter(
      (id): id is string => !!id && id !== requester.id,
    );
    this.realtime.emitWorkLog(recipients, {
      id: workLog.id,
      taskId: workLog.taskId,
      userId: workLog.userId,
      activity: workLog.activity,
      progress: workLog.progress,
      createdAt: workLog.createdAt,
    });

    return workLog;
  }

  /** List work log sebuah task (siapa pun yang boleh melihat task). */
  async findAll(taskId: string, requester: AuthUser) {
    await this.tasksService.assertTaskAccess(taskId, requester);
    return this.prisma.workLog.findMany({
      where: { taskId },
      select: WORK_LOG_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Hapus work log: hanya pencatat atau ADMIN/SUPER_ADMIN. */
  async remove(
    taskId: string,
    workLogId: string,
    requester: AuthUser,
  ): Promise<{ id: string; deleted: true }> {
    await this.tasksService.assertTaskAccess(taskId, requester);

    const workLog = await this.prisma.workLog.findFirst({
      where: { id: workLogId, taskId },
      select: { id: true, userId: true },
    });
    if (!workLog) {
      throw new NotFoundException('Work log tidak ditemukan');
    }

    const canDelete =
      this.isAdmin(requester) || workLog.userId === requester.id;
    if (!canDelete) {
      throw new ForbiddenException(
        'Hanya pencatat atau admin yang dapat menghapus work log',
      );
    }

    await this.prisma.workLog.delete({ where: { id: workLog.id } });
    return { id: workLog.id, deleted: true };
  }

  private isAdmin(requester: AuthUser): boolean {
    return ADMIN_ROLES.includes(requester.role as UserRole);
  }
}
