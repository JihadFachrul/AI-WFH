import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  buildPaginationMeta,
  getSkip,
  Paginated,
} from '../../common/utils/pagination.util';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { TasksService } from '../tasks/tasks.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RealtimeService } from '../realtime/realtime.service';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';

/** Field comment + author yang dipilih eksplisit (no overfetch). */
const COMMENT_SELECT = {
  id: true,
  content: true,
  taskId: true,
  authorId: true,
  createdAt: true,
  updatedAt: true,
  author: { select: { id: true, name: true, email: true } },
} satisfies Prisma.TaskCommentSelect;

type CommentView = Prisma.TaskCommentGetPayload<{
  select: typeof COMMENT_SELECT;
}>;

@Injectable()
export class TaskCommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tasksService: TasksService,
    private readonly notifications: NotificationsService,
    private readonly realtime: RealtimeService,
  ) {}

  /**
   * Tambah comment ke task. Akses task diverifikasi ulang lewat TasksService
   * (EMPLOYEE hanya boleh comment task miliknya). author = requester.
   */
  async create(
    taskId: string,
    dto: CreateTaskCommentDto,
    requester: AuthUser,
  ): Promise<CommentView> {
    const task = await this.tasksService.assertTaskAccess(taskId, requester);

    const comment = await this.prisma.taskComment.create({
      data: {
        content: dto.content,
        taskId,
        authorId: requester.id,
      },
      select: COMMENT_SELECT,
    });

    // Trigger: stakeholder (assignee & creator) diberi tahu, kecuali pengomentar.
    const recipients = [task.assigneeId, task.creatorId].filter(
      (id): id is string => !!id && id !== requester.id,
    );
    for (const recipientId of [...new Set(recipients)]) {
      await this.notifications.notifyTaskComment(
        recipientId,
        requester.name,
        task.title,
      );
    }

    // Realtime task:comment ke stakeholder (dedup di RealtimeService).
    this.realtime.emitTaskComment(recipients, {
      id: comment.id,
      taskId: comment.taskId,
      content: comment.content,
      authorId: comment.authorId,
      createdAt: comment.createdAt,
    });

    return comment;
  }

  /** List comment milik sebuah task (pagination sederhana, urut terbaru dulu). */
  async findAll(
    taskId: string,
    query: PaginationQueryDto,
    requester: AuthUser,
  ): Promise<Paginated<CommentView>> {
    await this.tasksService.assertTaskAccess(taskId, requester);

    const { page, limit } = query;
    const where: Prisma.TaskCommentWhereInput = { taskId, deletedAt: null };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.taskComment.findMany({
        where,
        select: COMMENT_SELECT,
        skip: getSkip(page, limit),
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.taskComment.count({ where }),
    ]);

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }
}
