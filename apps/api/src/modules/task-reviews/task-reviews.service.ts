import { Injectable } from '@nestjs/common';
import { Prisma, ReviewDecision } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { TasksService } from '../tasks/tasks.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RealtimeService } from '../realtime/realtime.service';
import { CreateReviewDto } from './dto/create-review.dto';

/** Field review + reviewer yang dikembalikan (no overfetch). */
const REVIEW_SELECT = {
  id: true,
  taskId: true,
  reviewerId: true,
  decision: true,
  note: true,
  createdAt: true,
  reviewer: { select: { id: true, name: true, email: true } },
} satisfies Prisma.TaskReviewSelect;

@Injectable()
export class TaskReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tasksService: TasksService,
    private readonly notifications: NotificationsService,
    private readonly realtime: RealtimeService,
  ) {}

  /** Employee submit task untuk direview (status → REVIEW). */
  submitForReview(taskId: string, requester: AuthUser) {
    return this.tasksService.submitForReview(taskId, requester);
  }

  /** List riwayat review sebuah task (siapa pun yang boleh melihat task). */
  async findAll(taskId: string, requester: AuthUser) {
    await this.tasksService.assertTaskAccess(taskId, requester);
    return this.prisma.taskReview.findMany({
      where: { taskId },
      select: REVIEW_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Manager membuat review. Otorisasi role (MANAGER/ADMIN/SUPER_ADMIN)
   * ditegakkan RolesGuard di controller. Selalu membuat record baru
   * (history tidak pernah ditimpa), lalu update status task, notifikasi,
   * dan emit realtime ke stakeholder.
   */
  async create(taskId: string, requester: AuthUser, dto: CreateReviewDto) {
    const task = await this.tasksService.assertTaskAccess(taskId, requester);

    const review = await this.prisma.taskReview.create({
      data: {
        taskId,
        reviewerId: requester.id,
        decision: dto.decision,
        note: dto.note,
      },
      select: REVIEW_SELECT,
    });

    // APPROVED → DONE, REVISION → IN_PROGRESS.
    await this.tasksService.applyReviewDecision(taskId, dto.decision);

    // Notifikasi + realtime ke stakeholder (assignee & creator), kecuali reviewer.
    const recipients = [task.assigneeId, task.creatorId].filter(
      (id): id is string => !!id && id !== requester.id,
    );
    const approved = dto.decision === ReviewDecision.APPROVED;
    for (const recipientId of [...new Set(recipients)]) {
      await this.notifications.notifyTaskReview(recipientId, approved);
    }
    this.realtime.emitReview(recipients, {
      id: review.id,
      taskId: review.taskId,
      decision: review.decision,
      note: review.note,
      createdAt: review.createdAt,
    });

    return review;
  }
}
