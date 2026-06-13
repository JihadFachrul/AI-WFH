import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthUser } from '../auth/strategies/jwt.strategy';
import { RealtimeService } from '../realtime/realtime.service';

const SESSION_SELECT = {
  id: true,
  userId: true,
  startedAt: true,
  endedAt: true,
  durationMinutes: true,
  createdAt: true,
} satisfies Prisma.WorkSessionSelect;

@Injectable()
export class WorkSessionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeService,
  ) {}

  /** Mulai sesi kerja. Ditolak bila sudah ada sesi aktif (1 aktif per user). */
  async start(requester: AuthUser) {
    const active = await this.prisma.workSession.findFirst({
      where: { userId: requester.id, endedAt: null },
      select: { id: true },
    });
    if (active) {
      throw new ConflictException('Anda sudah memiliki sesi kerja aktif.');
    }

    const session = await this.prisma.workSession.create({
      data: { userId: requester.id, startedAt: new Date() },
      select: SESSION_SELECT,
    });

    this.realtime.emitSessionStarted({
      userId: requester.id,
      sessionId: session.id,
      startedAt: session.startedAt,
    });

    return session;
  }

  /** Akhiri sesi aktif; durationMinutes dihitung otomatis. */
  async end(requester: AuthUser) {
    const active = await this.prisma.workSession.findFirst({
      where: { userId: requester.id, endedAt: null },
      orderBy: { startedAt: 'desc' },
    });
    if (!active) {
      throw new NotFoundException('Tidak ada sesi kerja aktif.');
    }

    const endedAt = new Date();
    const durationMinutes = Math.max(
      0,
      Math.round((endedAt.getTime() - active.startedAt.getTime()) / 60000),
    );

    const session = await this.prisma.workSession.update({
      where: { id: active.id },
      data: { endedAt, durationMinutes },
      select: SESSION_SELECT,
    });

    this.realtime.emitSessionEnded({
      userId: requester.id,
      sessionId: session.id,
      durationMinutes: session.durationMinutes,
    });

    return session;
  }

  /** Sesi aktif milik user (null jika tidak sedang bekerja). */
  getMySession(requester: AuthUser) {
    return this.prisma.workSession.findFirst({
      where: { userId: requester.id, endedAt: null },
      select: SESSION_SELECT,
      orderBy: { startedAt: 'desc' },
    });
  }

  /**
   * Status presence seluruh anggota (untuk manager). Satu query dengan sesi
   * aktif ter-nest (hindari N+1). User nonaktif/terhapus dikecualikan.
   */
  async getTeam() {
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null, isActive: true },
      select: {
        id: true,
        name: true,
        role: true,
        workSessions: {
          where: { endedAt: null },
          select: { id: true, startedAt: true },
          orderBy: { startedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { name: 'asc' },
    });

    return users.map((u) => ({
      id: u.id,
      name: u.name,
      role: u.role,
      activeSession: u.workSessions[0] ?? null,
    }));
  }
}
