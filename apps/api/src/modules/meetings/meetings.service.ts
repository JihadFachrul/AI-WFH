import {
  BadRequestException,
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
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { NotificationsService } from '../notifications/notifications.service';
import { RealtimeService } from '../realtime/realtime.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { QueryMeetingsDto } from './dto/query-meetings.dto';

const PRIVILEGED: UserRole[] = [
  UserRole.MANAGER,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];
const ADMINS: UserRole[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

const MEETING_SELECT = {
  id: true,
  title: true,
  description: true,
  startAt: true,
  endAt: true,
  meetingUrl: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  createdBy: { select: { id: true, name: true, email: true } },
  participants: {
    select: { id: true, user: { select: { id: true, name: true, email: true } } },
  },
} satisfies Prisma.MeetingSelect;

type MeetingRow = Prisma.MeetingGetPayload<{ select: typeof MEETING_SELECT }>;

@Injectable()
export class MeetingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly realtime: RealtimeService,
  ) {}

  async create(dto: CreateMeetingDto, requester: AuthUser): Promise<MeetingRow> {
    this.assertTimeRange(dto.startAt, dto.endAt);
    const participantIds = await this.validateParticipants(dto.participantIds);

    const meeting = await this.prisma.meeting.create({
      data: {
        title: dto.title,
        description: dto.description,
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
        meetingUrl: dto.meetingUrl,
        createdById: requester.id,
        participants: participantIds.length
          ? { create: participantIds.map((userId) => ({ userId })) }
          : undefined,
      },
      select: MEETING_SELECT,
    });

    await this.fanOut(meeting, requester, 'created');
    return meeting;
  }

  /** List meeting ter-paginasi (scope by role) + search + filter date. */
  async findAll(
    query: QueryMeetingsDto,
    requester: AuthUser,
  ): Promise<Paginated<MeetingRow>> {
    const { page, limit, search, date } = query;
    const where: Prisma.MeetingWhereInput = {
      ...this.scopeWhere(requester),
      ...(search ? { title: { contains: search, mode: 'insensitive' } } : {}),
      ...(date ? { startAt: this.dayRange(date) } : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.meeting.findMany({
        where,
        select: MEETING_SELECT,
        skip: getSkip(page, limit),
        take: limit,
        orderBy: { startAt: 'desc' },
      }),
      this.prisma.meeting.count({ where }),
    ]);
    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  /** Meeting hari ini (scope by role), urut paling awal dulu. */
  async today(requester: AuthUser): Promise<MeetingRow[]> {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return this.prisma.meeting.findMany({
      where: {
        ...this.scopeWhere(requester),
        startAt: { gte: start, lt: end },
      },
      select: MEETING_SELECT,
      orderBy: { startAt: 'asc' },
    });
  }

  async findOne(id: string, requester: AuthUser): Promise<MeetingRow> {
    const meeting = await this.loadActive(id);
    this.assertCanView(meeting, requester);
    return meeting;
  }

  /** Update: ADMIN/SUPER_ADMIN siapa saja; MANAGER hanya meeting buatannya. */
  async update(
    id: string,
    dto: UpdateMeetingDto,
    requester: AuthUser,
  ): Promise<MeetingRow> {
    const existing = await this.loadActive(id);
    if (!this.isAdmin(requester) && existing.createdById !== requester.id) {
      throw new ForbiddenException(
        'Hanya pembuat meeting atau admin yang dapat mengubah',
      );
    }
    if (dto.startAt || dto.endAt) {
      this.assertTimeRange(
        dto.startAt ?? existing.startAt.toISOString(),
        dto.endAt ?? existing.endAt.toISOString(),
      );
    }
    const participantIds = dto.participantIds
      ? await this.validateParticipants(dto.participantIds)
      : null;

    const updated = await this.prisma.$transaction(async (tx) => {
      if (participantIds) {
        await tx.meetingParticipant.deleteMany({ where: { meetingId: id } });
        if (participantIds.length) {
          await tx.meetingParticipant.createMany({
            data: participantIds.map((userId) => ({ meetingId: id, userId })),
          });
        }
      }
      return tx.meeting.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description,
          startAt: dto.startAt ? new Date(dto.startAt) : undefined,
          endAt: dto.endAt ? new Date(dto.endAt) : undefined,
          meetingUrl: dto.meetingUrl,
        },
        select: MEETING_SELECT,
      });
    });

    await this.fanOut(updated, requester, 'updated');
    return updated;
  }

  /** Soft delete (ADMIN/SUPER_ADMIN — ditegakkan RolesGuard). */
  async remove(
    id: string,
    requester: AuthUser,
  ): Promise<{ id: string; deleted: true }> {
    const meeting = await this.loadActive(id);
    await this.prisma.meeting.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: { id: true },
    });

    const recipients = this.recipientsOf(meeting, requester);
    this.realtime.emitMeetingDeleted(recipients, meeting.id);
    return { id: meeting.id, deleted: true };
  }

  // ============================================================
  // Helpers
  // ============================================================

  private async loadActive(id: string): Promise<MeetingRow> {
    const meeting = await this.prisma.meeting.findFirst({
      where: { id, deletedAt: null },
      select: MEETING_SELECT,
    });
    if (!meeting) throw new NotFoundException('Meeting tidak ditemukan');
    return meeting;
  }

  /** Scope list/today: privileged lihat semua; lainnya hanya yang melibatkan dirinya. */
  private scopeWhere(requester: AuthUser): Prisma.MeetingWhereInput {
    if (this.isPrivileged(requester)) return { deletedAt: null };
    return {
      deletedAt: null,
      OR: [
        { createdById: requester.id },
        { participants: { some: { userId: requester.id } } },
      ],
    };
  }

  private assertCanView(meeting: MeetingRow, requester: AuthUser): void {
    if (this.isPrivileged(requester)) return;
    const involved =
      meeting.createdById === requester.id ||
      meeting.participants.some((p) => p.user.id === requester.id);
    if (!involved) {
      throw new ForbiddenException('Anda tidak memiliki akses ke meeting ini');
    }
  }

  private assertTimeRange(startAt: string, endAt: string): void {
    if (new Date(endAt).getTime() <= new Date(startAt).getTime()) {
      throw new BadRequestException('Waktu selesai harus setelah waktu mulai');
    }
  }

  private async validateParticipants(ids?: string[]): Promise<string[]> {
    const unique = [...new Set(ids ?? [])];
    if (unique.length === 0) return [];
    const count = await this.prisma.user.count({
      where: { id: { in: unique }, deletedAt: null },
    });
    if (count !== unique.length) {
      throw new BadRequestException('Sebagian peserta tidak ditemukan');
    }
    return unique;
  }

  /** Penerima notifikasi/realtime: peserta + pembuat, tanpa aktor, unik. */
  private recipientsOf(meeting: MeetingRow, requester: AuthUser): string[] {
    const ids = [
      meeting.createdById,
      ...meeting.participants.map((p) => p.user.id),
    ].filter((id) => id !== requester.id);
    return [...new Set(ids)];
  }

  private async fanOut(
    meeting: MeetingRow,
    requester: AuthUser,
    action: 'created' | 'updated',
  ): Promise<void> {
    const recipients = this.recipientsOf(meeting, requester);
    const title = action === 'created' ? 'Meeting Scheduled' : 'Meeting Updated';
    const message =
      action === 'created'
        ? `Anda diundang ke meeting: ${meeting.title}`
        : `Meeting diperbarui: ${meeting.title}`;
    for (const recipientId of recipients) {
      await this.notifications.createNotification(recipientId, title, message);
    }
    const payload = {
      id: meeting.id,
      title: meeting.title,
      startAt: meeting.startAt,
    };
    if (action === 'created') {
      this.realtime.emitMeetingCreated(recipients, payload);
    } else {
      this.realtime.emitMeetingUpdated(recipients, payload);
    }
  }

  private dayRange(date: string): Prisma.DateTimeFilter {
    const start = new Date(date);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    return { gte: start, lt: end };
  }

  private isPrivileged(requester: AuthUser): boolean {
    return PRIVILEGED.includes(requester.role as UserRole);
  }
  private isAdmin(requester: AuthUser): boolean {
    return ADMINS.includes(requester.role as UserRole);
  }
}
