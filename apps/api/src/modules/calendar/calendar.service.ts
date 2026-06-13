import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CalendarEventType, Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  buildPaginationMeta,
  getSkip,
  Paginated,
} from '../../common/utils/pagination.util';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { NotificationsService } from '../notifications/notifications.service';
import { RealtimeService } from '../realtime/realtime.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import {
  QueryCalendarDto,
  QueryMonthDto,
  QueryUpcomingDto,
} from './dto/query-calendar.dto';

const PRIVILEGED: UserRole[] = [
  UserRole.MANAGER,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];
const ADMINS: UserRole[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

const EVENT_SELECT = {
  id: true,
  title: true,
  description: true,
  type: true,
  startAt: true,
  endAt: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  createdBy: { select: { id: true, name: true, email: true } },
} satisfies Prisma.CalendarEventSelect;

type EventRow = Prisma.CalendarEventGetPayload<{ select: typeof EVENT_SELECT }>;

/**
 * Item terpadu pada timeline kalender. `source` membedakan asal data:
 * Meeting (6.1, source-of-truth, dibaca read-only) vs CalendarEvent (6.2).
 */
export interface CalendarItem {
  id: string;
  source: 'MEETING' | 'EVENT';
  type: CalendarEventType;
  title: string;
  description: string | null;
  startAt: Date;
  endAt: Date;
  organizer: { id: string; name: string };
  meetingUrl: string | null;
}

@Injectable()
export class CalendarService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly realtime: RealtimeService,
  ) {}

  // ============================================================
  // CRUD CalendarEvent
  // ============================================================

  async create(
    dto: CreateCalendarEventDto,
    requester: AuthUser,
  ): Promise<EventRow> {
    this.assertTimeRange(dto.startAt, dto.endAt);

    const event = await this.prisma.calendarEvent.create({
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type,
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
        createdById: requester.id,
      },
      select: EVENT_SELECT,
    });

    await this.fanOut(event, requester, 'created');
    return event;
  }

  /** List CalendarEvent ter-paginasi (semua user login boleh lihat). */
  async findAll(
    query: QueryCalendarDto,
    _requester: AuthUser,
  ): Promise<Paginated<EventRow>> {
    const { page, limit, search, type } = query;
    const where: Prisma.CalendarEventWhereInput = {
      deletedAt: null,
      ...(search ? { title: { contains: search, mode: 'insensitive' } } : {}),
      ...(type ? { type } : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.calendarEvent.findMany({
        where,
        select: EVENT_SELECT,
        skip: getSkip(page, limit),
        take: limit,
        orderBy: { startAt: 'desc' },
      }),
      this.prisma.calendarEvent.count({ where }),
    ]);
    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOne(id: string, _requester: AuthUser): Promise<EventRow> {
    return this.loadActive(id);
  }

  /** Update: ADMIN/SUPER_ADMIN siapa saja; MANAGER hanya event buatannya. */
  async update(
    id: string,
    dto: UpdateCalendarEventDto,
    requester: AuthUser,
  ): Promise<EventRow> {
    const existing = await this.loadActive(id);
    if (!this.isAdmin(requester) && existing.createdById !== requester.id) {
      throw new ForbiddenException(
        'Hanya pembuat event atau admin yang dapat mengubah',
      );
    }
    if (dto.startAt || dto.endAt) {
      this.assertTimeRange(
        dto.startAt ?? existing.startAt.toISOString(),
        dto.endAt ?? existing.endAt.toISOString(),
      );
    }

    const updated = await this.prisma.calendarEvent.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type,
        startAt: dto.startAt ? new Date(dto.startAt) : undefined,
        endAt: dto.endAt ? new Date(dto.endAt) : undefined,
      },
      select: EVENT_SELECT,
    });

    await this.fanOut(updated, requester, 'updated');
    return updated;
  }

  /** Soft delete (ADMIN/SUPER_ADMIN — ditegakkan RolesGuard). */
  async remove(
    id: string,
    _requester: AuthUser,
  ): Promise<{ id: string; deleted: true }> {
    const event = await this.loadActive(id);
    await this.prisma.calendarEvent.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: { id: true },
    });
    this.realtime.emitCalendarEventDeleted(event.id);
    return { id: event.id, deleted: true };
  }

  // ============================================================
  // Timeline gabungan (Meeting + CalendarEvent)
  // ============================================================

  /** Seluruh item dalam rentang satu bulan, urut paling awal dulu. */
  async month(
    query: QueryMonthDto,
    requester: AuthUser,
  ): Promise<CalendarItem[]> {
    const now = new Date();
    const year = query.year ?? now.getUTCFullYear();
    const month = query.month ?? now.getUTCMonth() + 1; // 1-12
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1)); // awal bulan berikutnya

    const items = await this.collectItems(
      { gte: start, lt: end },
      requester,
    );
    return this.sortAsc(items);
  }

  /** Event mendatang (startAt >= sekarang), urut terdekat dulu, dibatasi limit. */
  async upcoming(
    query: QueryUpcomingDto,
    requester: AuthUser,
  ): Promise<CalendarItem[]> {
    const limit = query.limit ?? 5;
    const items = await this.collectItems(
      { gte: new Date() },
      requester,
      limit,
    );
    return this.sortAsc(items).slice(0, limit);
  }

  // ============================================================
  // Helpers
  // ============================================================

  /**
   * Gabungkan CalendarEvent + Meeting pada rentang waktu yang sama.
   * Meeting dibaca read-only (tetap source-of-truth, tidak disalin) dan
   * mengikuti scope visibilitas 6.1 (privileged lihat semua, lainnya hanya
   * meeting yang melibatkannya). CalendarEvent bersifat perusahaan-wide.
   */
  private async collectItems(
    range: Prisma.DateTimeFilter,
    requester: AuthUser,
    take?: number,
  ): Promise<CalendarItem[]> {
    const [events, meetings] = await this.prisma.$transaction([
      this.prisma.calendarEvent.findMany({
        where: { deletedAt: null, startAt: range },
        select: EVENT_SELECT,
        orderBy: { startAt: 'asc' },
        ...(take ? { take } : {}),
      }),
      this.prisma.meeting.findMany({
        where: { ...this.meetingScope(requester), startAt: range },
        select: {
          id: true,
          title: true,
          description: true,
          startAt: true,
          endAt: true,
          meetingUrl: true,
          createdBy: { select: { id: true, name: true } },
        },
        orderBy: { startAt: 'asc' },
        ...(take ? { take } : {}),
      }),
    ]);

    const eventItems: CalendarItem[] = events.map((e) => ({
      id: e.id,
      source: 'EVENT',
      type: e.type,
      title: e.title,
      description: e.description,
      startAt: e.startAt,
      endAt: e.endAt,
      organizer: { id: e.createdBy.id, name: e.createdBy.name },
      meetingUrl: null,
    }));

    const meetingItems: CalendarItem[] = meetings.map((m) => ({
      id: m.id,
      source: 'MEETING',
      type: CalendarEventType.MEETING,
      title: m.title,
      description: m.description,
      startAt: m.startAt,
      endAt: m.endAt,
      organizer: { id: m.createdBy.id, name: m.createdBy.name },
      meetingUrl: m.meetingUrl,
    }));

    return [...eventItems, ...meetingItems];
  }

  /** Scope meeting (selaras 6.1): privileged semua; lainnya hanya yang melibatkan dirinya. */
  private meetingScope(requester: AuthUser): Prisma.MeetingWhereInput {
    if (this.isPrivileged(requester)) return { deletedAt: null };
    return {
      deletedAt: null,
      OR: [
        { createdById: requester.id },
        { participants: { some: { userId: requester.id } } },
      ],
    };
  }

  private sortAsc(items: CalendarItem[]): CalendarItem[] {
    return items.sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
  }

  private async loadActive(id: string): Promise<EventRow> {
    const event = await this.prisma.calendarEvent.findFirst({
      where: { id, deletedAt: null },
      select: EVENT_SELECT,
    });
    if (!event) throw new NotFoundException('Calendar event tidak ditemukan');
    return event;
  }

  private assertTimeRange(startAt: string, endAt: string): void {
    if (new Date(endAt).getTime() <= new Date(startAt).getTime()) {
      throw new BadRequestException('Waktu selesai harus setelah waktu mulai');
    }
  }

  /**
   * Notifikasi + realtime saat event dibuat/diubah. Kalender bersifat
   * perusahaan-wide → seluruh user aktif diberi tahu (kecuali aktor sendiri).
   */
  private async fanOut(
    event: EventRow,
    requester: AuthUser,
    action: 'created' | 'updated',
  ): Promise<void> {
    const recipients = await this.prisma.user.findMany({
      where: { deletedAt: null, isActive: true, id: { not: requester.id } },
      select: { id: true },
    });
    const title =
      action === 'created' ? 'New Calendar Event' : 'Calendar Event Updated';
    const message =
      action === 'created'
        ? `Event baru: ${event.title}`
        : `Event diperbarui: ${event.title}`;
    for (const r of recipients) {
      await this.notifications.createNotification(r.id, title, message);
    }

    const payload = {
      id: event.id,
      title: event.title,
      type: event.type,
      startAt: event.startAt,
    };
    if (action === 'created') {
      this.realtime.emitCalendarEventCreated(payload);
    } else {
      this.realtime.emitCalendarEventUpdated(payload);
    }
  }

  private isPrivileged(requester: AuthUser): boolean {
    return PRIVILEGED.includes(requester.role as UserRole);
  }
  private isAdmin(requester: AuthUser): boolean {
    return ADMINS.includes(requester.role as UserRole);
  }
}
