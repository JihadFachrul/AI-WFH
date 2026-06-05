import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  buildPaginationMeta,
  getSkip,
  Paginated,
} from '../../common/utils/pagination.util';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { NotificationsService } from '../notifications/notifications.service';
import { RealtimeService, RealtimeTask } from '../realtime/realtime.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';

/** Field + relasi yang dipilih eksplisit (hindari overfetch & N+1 via join). */
const TASK_SELECT = {
  id: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  dueDate: true,
  assigneeId: true,
  creatorId: true,
  createdAt: true,
  updatedAt: true,
  assignee: { select: { id: true, name: true, email: true } },
  creator: { select: { id: true, name: true, email: true } },
} satisfies Prisma.TaskSelect;

export type TaskRow = Prisma.TaskGetPayload<{ select: typeof TASK_SELECT }>;

/** Bentuk task yang dikembalikan ke client (vocabulary: assignedToId/createdById). */
export interface TaskView {
  id: string;
  title: string;
  description: string | null;
  status: TaskRow['status'];
  priority: TaskRow['priority'];
  dueDate: Date | null;
  assignedToId: string | null;
  createdById: string;
  assignedTo: TaskRow['assignee'];
  createdBy: TaskRow['creator'];
  createdAt: Date;
  updatedAt: Date;
}

/** Role yang punya akses penuh terhadap task (create/assign/update-all/delete). */
const TASK_PRIVILEGED: UserRole[] = [
  UserRole.MANAGER,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly realtime: RealtimeService,
  ) {}

  // ============================================================
  // CRUD
  // ============================================================

  /** Buat task. Creator = requester. assignedToId opsional (sudah dicek role). */
  async create(dto: CreateTaskDto, requester: AuthUser): Promise<TaskView> {
    if (dto.assignedToId) {
      await this.assertUserExists(dto.assignedToId);
    }

    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        assigneeId: dto.assignedToId,
        creatorId: requester.id,
      },
      select: TASK_SELECT,
    });

    // Trigger: assignee diberi tahu (kecuali kalau meng-assign ke diri sendiri).
    if (task.assigneeId && task.assigneeId !== requester.id) {
      await this.notifications.notifyTaskAssigned(task.assigneeId, task.title);
      this.realtime.emitTaskAssigned(task.assigneeId, this.toRealtimeTask(task));
    }

    return this.toTaskView(task);
  }

  /**
   * List task dengan pagination + search + filter.
   * EMPLOYEE otomatis hanya melihat task yang di-assign ke dirinya.
   */
  async findAll(
    query: QueryTasksDto,
    requester: AuthUser,
  ): Promise<Paginated<TaskView>> {
    const { page, limit } = query;
    const where = this.buildWhere(query, requester);

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        select: TASK_SELECT,
        skip: getSkip(page, limit),
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: rows.map((row) => this.toTaskView(row)),
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  /** Ambil satu task; EMPLOYEE hanya boleh task miliknya (assignee/creator). */
  async findOne(id: string, requester: AuthUser): Promise<TaskView> {
    const task = await this.loadActiveTask(id);
    this.assertCanView(task, requester);
    return this.toTaskView(task);
  }

  /**
   * Update task. MANAGER/ADMIN boleh semua; EMPLOYEE hanya task yang
   * di-assign ke dirinya. Mengubah assignedToId (assign) hanya untuk privileged.
   */
  async update(
    id: string,
    dto: UpdateTaskDto,
    requester: AuthUser,
  ): Promise<TaskView> {
    const task = await this.loadActiveTask(id);
    this.assertCanModify(task, requester);

    if (dto.assignedToId !== undefined) {
      if (!this.isPrivileged(requester)) {
        throw new ForbiddenException(
          'Hanya manager/admin yang dapat meng-assign task',
        );
      }
      await this.assertUserExists(dto.assignedToId);
    }

    const prevStatus = task.status;
    const prevAssigneeId = task.assigneeId;

    const updated = await this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        ...(dto.assignedToId !== undefined
          ? { assigneeId: dto.assignedToId }
          : {}),
      },
      select: TASK_SELECT,
    });

    await this.emitUpdateNotifications(
      updated,
      requester,
      prevStatus,
      prevAssigneeId,
    );

    return this.toTaskView(updated);
  }

  /**
   * Kirim notifikasi terkait perubahan pada update task:
   * - assignee baru diberi tahu (jika berubah & bukan dirinya yang mengubah)
   * - perubahan status diberitahukan ke stakeholder (assignee & creator),
   *   selain orang yang melakukan perubahan. Tanpa duplikat.
   */
  private async emitUpdateNotifications(
    task: TaskRow,
    requester: AuthUser,
    prevStatus: TaskRow['status'],
    prevAssigneeId: string | null,
  ): Promise<void> {
    // Assignment berubah
    if (
      task.assigneeId &&
      task.assigneeId !== prevAssigneeId &&
      task.assigneeId !== requester.id
    ) {
      await this.notifications.notifyTaskAssigned(task.assigneeId, task.title);
      this.realtime.emitTaskAssigned(task.assigneeId, this.toRealtimeTask(task));
    }

    // Status berubah → beri tahu stakeholder unik, kecuali aktor
    if (task.status !== prevStatus) {
      const recipients = [task.assigneeId, task.creatorId].filter(
        (id): id is string => !!id && id !== requester.id,
      );
      for (const recipientId of [...new Set(recipients)]) {
        await this.notifications.notifyTaskStatusUpdated(
          recipientId,
          task.status,
        );
      }
      // Realtime task:updated ke seluruh stakeholder (termasuk aktor lain device).
      this.realtime.emitTaskUpdated(recipients, this.toRealtimeTask(task));
    }
  }

  /** Petakan TaskRow ke payload realtime yang ringkas & stabil. */
  private toRealtimeTask(task: TaskRow): RealtimeTask {
    return {
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      assignedToId: task.assigneeId,
      createdById: task.creatorId,
    };
  }

  /** Soft delete (set deletedAt). Hanya MANAGER/ADMIN (ditegakkan via RolesGuard). */
  async remove(
    id: string,
    requester: AuthUser,
  ): Promise<{ id: string; deleted: true }> {
    const task = await this.loadActiveTask(id);
    // Pertahanan berlapis selain RolesGuard.
    if (!this.isPrivileged(requester)) {
      throw new ForbiddenException('Anda tidak dapat menghapus task');
    }
    await this.prisma.task.update({
      where: { id: task.id },
      data: { deletedAt: new Date() },
      select: { id: true },
    });
    return { id: task.id, deleted: true };
  }

  // ============================================================
  // Dipakai oleh TaskCommentsService (reuse authorization)
  // ============================================================

  /**
   * Pastikan task ada & aktif, dan requester berhak melihatnya.
   * Mengembalikan task row (dipakai TaskCommentsService untuk notifikasi).
   */
  async assertTaskAccess(
    taskId: string,
    requester: AuthUser,
  ): Promise<TaskRow> {
    const task = await this.loadActiveTask(taskId);
    this.assertCanView(task, requester);
    return task;
  }

  // ============================================================
  // Helpers
  // ============================================================

  private buildWhere(
    query: QueryTasksDto,
    requester: AuthUser,
  ): Prisma.TaskWhereInput {
    const { search, status, priority, assignedToId, createdById, dueDate } =
      query;

    const where: Prisma.TaskWhereInput = {
      deletedAt: null,
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
      ...(assignedToId ? { assigneeId: assignedToId } : {}),
      ...(createdById ? { creatorId: createdById } : {}),
      ...(dueDate ? { dueDate: this.dayRange(dueDate) } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    // EMPLOYEE dibatasi hanya task miliknya, apapun filter yang dikirim.
    if (!this.isPrivileged(requester)) {
      where.assigneeId = requester.id;
    }

    return where;
  }

  /** Rentang [00:00, +1 hari) UTC untuk filter dueDate. */
  private dayRange(dueDate: string): Prisma.DateTimeFilter {
    const start = new Date(dueDate);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    return { gte: start, lt: end };
  }

  private async loadActiveTask(id: string): Promise<TaskRow> {
    const task = await this.prisma.task.findFirst({
      where: { id, deletedAt: null },
      select: TASK_SELECT,
    });
    if (!task) {
      throw new NotFoundException('Task tidak ditemukan');
    }
    return task;
  }

  private isPrivileged(requester: AuthUser): boolean {
    return TASK_PRIVILEGED.includes(requester.role as UserRole);
  }

  private assertCanView(task: TaskRow, requester: AuthUser): void {
    const isOwner =
      task.assigneeId === requester.id || task.creatorId === requester.id;
    if (!this.isPrivileged(requester) && !isOwner) {
      throw new ForbiddenException('Anda tidak memiliki akses ke task ini');
    }
  }

  private assertCanModify(task: TaskRow, requester: AuthUser): void {
    const isAssignee = task.assigneeId === requester.id;
    if (!this.isPrivileged(requester) && !isAssignee) {
      throw new ForbiddenException(
        'Anda hanya dapat mengubah task yang ditugaskan kepada Anda',
      );
    }
  }

  private async assertUserExists(userId: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: { id: true },
    });
    if (!user) {
      throw new NotFoundException('User yang akan di-assign tidak ditemukan');
    }
  }

  private toTaskView(task: TaskRow): TaskView {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignedToId: task.assigneeId,
      createdById: task.creatorId,
      assignedTo: task.assignee,
      createdBy: task.creator,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}
