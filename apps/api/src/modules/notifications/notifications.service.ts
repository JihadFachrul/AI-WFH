import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, TaskStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  buildPaginationMeta,
  getSkip,
  Paginated,
} from '../../common/utils/pagination.util';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { RealtimeService } from '../realtime/realtime.service';

/** Field notification yang dipilih eksplisit (no overfetch). */
const NOTIFICATION_SELECT = {
  id: true,
  title: true,
  message: true,
  isRead: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.NotificationSelect;

type NotificationView = Prisma.NotificationGetPayload<{
  select: typeof NOTIFICATION_SELECT;
}>;

/**
 * NotificationsService: satu-satunya tempat notification dibuat & dibaca
 * (centralized). Method notify* dipakai oleh modul lain sebagai side-effect
 * dan bersifat best-effort — kegagalannya tidak boleh menggagalkan operasi inti.
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeService,
  ) {}

  // ============================================================
  // Query (milik user yang sedang login)
  // ============================================================

  /** Semua notifikasi milik user, terbaru dahulu, ter-paginasi. */
  findAll(
    userId: string,
    query: PaginationQueryDto,
  ): Promise<Paginated<NotificationView>> {
    return this.paginate({ userId, deletedAt: null }, query);
  }

  /** Hanya notifikasi yang belum dibaca. */
  findUnread(
    userId: string,
    query: PaginationQueryDto,
  ): Promise<Paginated<NotificationView>> {
    return this.paginate({ userId, deletedAt: null, isRead: false }, query);
  }

  /**
   * Tandai satu notifikasi sebagai sudah dibaca. Filter `userId` membuat
   * operasi ini hanya berlaku untuk milik user sendiri (tanpa bypass admin).
   */
  async markAsRead(userId: string, id: string): Promise<NotificationView> {
    const result = await this.prisma.notification.updateMany({
      where: { id, userId, deletedAt: null },
      data: { isRead: true },
    });
    if (result.count === 0) {
      throw new NotFoundException('Notifikasi tidak ditemukan');
    }
    // Aman: id sudah dipastikan milik user pada updateMany di atas.
    return this.prisma.notification.findUniqueOrThrow({
      where: { id },
      select: NOTIFICATION_SELECT,
    });
  }

  /** Tandai semua notifikasi user sebagai dibaca. */
  async markAllAsRead(userId: string): Promise<{ updated: number }> {
    const result = await this.prisma.notification.updateMany({
      where: { userId, deletedAt: null, isRead: false },
      data: { isRead: true },
    });
    return { updated: result.count };
  }

  // ============================================================
  // Creation (centralized) + reusable triggers
  // ============================================================

  /**
   * Pembuat notifikasi terpusat. Best-effort: error di-log, tidak dilempar,
   * agar trigger tidak pernah menggagalkan operasi task/comment.
   */
  async createNotification(
    userId: string,
    title: string,
    message: string,
  ): Promise<void> {
    try {
      const notification = await this.prisma.notification.create({
        data: { userId, title, message },
        select: NOTIFICATION_SELECT,
      });
      // Realtime push ke room user (best-effort, aman bila socket belum siap).
      this.realtime.emitNotification(userId, {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        createdAt: notification.createdAt,
      });
    } catch (error) {
      this.logger.warn(
        `Gagal membuat notifikasi untuk user ${userId}: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
    }
  }

  /** Trigger: task di-assign ke seseorang. */
  async notifyTaskAssigned(
    assigneeId: string,
    taskTitle: string,
  ): Promise<void> {
    await this.createNotification(
      assigneeId,
      'Task Assigned',
      `You have been assigned to task: ${taskTitle}`,
    );
  }

  /** Trigger: ada comment baru di task (untuk stakeholder, bukan pengomentar). */
  async notifyTaskComment(
    recipientId: string,
    commenterName: string,
    taskTitle: string,
  ): Promise<void> {
    await this.createNotification(
      recipientId,
      'New Task Comment',
      `${commenterName} commented on task: ${taskTitle}`,
    );
  }

  /** Trigger: status task berubah. */
  async notifyTaskStatusUpdated(
    recipientId: string,
    status: TaskStatus,
  ): Promise<void> {
    await this.createNotification(
      recipientId,
      'Task Status Updated',
      `Task status updated to ${status}`,
    );
  }

  // ============================================================
  // Helper
  // ============================================================

  private async paginate(
    where: Prisma.NotificationWhereInput,
    query: PaginationQueryDto,
  ): Promise<Paginated<NotificationView>> {
    const { page, limit } = query;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where,
        select: NOTIFICATION_SELECT,
        skip: getSkip(page, limit),
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);
    return { data, meta: buildPaginationMeta(total, page, limit) };
  }
}
