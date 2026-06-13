import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus, ReviewDecision, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export type KpiStatus = 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION';

export interface Kpi {
  completionRate: number;
  approvalRate: number;
  revisionRate: number;
  evidenceCompliance: number;
  workLogConsistency: number;
  sessionConsistency: number;
  status: KpiStatus;
  hasData: boolean;
}

export interface MemberKpi {
  id: string;
  name: string;
  role: UserRole;
  kpi: Kpi;
}

interface UserMeta {
  id: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

const MS_PER_DAY = 86_400_000;

function pct(part: number, whole: number): number {
  return whole === 0 ? 0 : Math.round((part / whole) * 100);
}

function statusFromOverall(overall: number): KpiStatus {
  if (overall >= 85) return 'EXCELLENT';
  if (overall >= 70) return 'GOOD';
  return 'NEEDS_ATTENTION';
}

/**
 * KpiService — menghitung KPI operasional secara DINAMIS dari data nyata
 * (Task, WorkLog, Evidence, Review, Session). Tidak ada tabel KPI / score
 * tersimpan; selalu dihitung ulang. Query dirancang efisien (groupBy/_count/
 * single-query + agregasi in-memory) — tanpa N+1 walau untuk KPI team.
 */
@Injectable()
export class KpiService {
  constructor(private readonly prisma: PrismaService) {}

  /** KPI satu user (untuk /me dan /users/:id). */
  async getForUser(userId: string): Promise<Kpi> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: { id: true, name: true, role: true, createdAt: true },
    });
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }
    const map = await this.computeKpiMap([user]);
    return map.get(userId)!;
  }

  /** KPI seluruh anggota aktif (untuk /team). */
  async getTeam(): Promise<MemberKpi[]> {
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null, isActive: true },
      select: { id: true, name: true, role: true, createdAt: true },
      orderBy: { name: 'asc' },
    });
    const map = await this.computeKpiMap(users);
    return users.map((u) => ({
      id: u.id,
      name: u.name,
      role: u.role,
      kpi: map.get(u.id)!,
    }));
  }

  /**
   * Inti perhitungan: untuk sekumpulan user, ambil data operasional dalam
   * SEDIKIT query lalu agregasi per user di memori (hindari N+1).
   */
  private async computeKpiMap(users: UserMeta[]): Promise<Map<string, Kpi>> {
    const userIds = users.map((u) => u.id);
    const result = new Map<string, Kpi>();
    if (userIds.length === 0) return result;

    // 1 query: semua task ter-assign + status + jumlah evidence & worklog.
    const tasks = await this.prisma.task.findMany({
      where: { assigneeId: { in: userIds }, deletedAt: null },
      select: {
        assigneeId: true,
        status: true,
        _count: { select: { evidences: true, workLogs: true } },
      },
    });

    // 1 query: review pada task milik user (untuk approval/revision rate).
    const reviews = await this.prisma.taskReview.findMany({
      where: { task: { assigneeId: { in: userIds }, deletedAt: null } },
      select: { decision: true, task: { select: { assigneeId: true } } },
    });

    // 1 query: sesi kerja (untuk konsistensi sesi).
    const sessions = await this.prisma.workSession.findMany({
      where: { userId: { in: userIds } },
      select: { userId: true, startedAt: true },
    });

    // --- agregasi per user ---
    type Acc = {
      assigned: number;
      completed: number;
      completedWithEvidence: number;
      tasksWithWorkLog: number;
      reviewsTotal: number;
      reviewsApproved: number;
      sessionDays: Set<string>;
    };
    const acc = new Map<string, Acc>();
    for (const id of userIds) {
      acc.set(id, {
        assigned: 0,
        completed: 0,
        completedWithEvidence: 0,
        tasksWithWorkLog: 0,
        reviewsTotal: 0,
        reviewsApproved: 0,
        sessionDays: new Set(),
      });
    }

    for (const t of tasks) {
      if (!t.assigneeId) continue;
      const a = acc.get(t.assigneeId);
      if (!a) continue;
      a.assigned += 1;
      if (t._count.workLogs > 0) a.tasksWithWorkLog += 1;
      if (t.status === TaskStatus.DONE) {
        a.completed += 1;
        if (t._count.evidences > 0) a.completedWithEvidence += 1;
      }
    }

    for (const r of reviews) {
      const id = r.task.assigneeId;
      if (!id) continue;
      const a = acc.get(id);
      if (!a) continue;
      a.reviewsTotal += 1;
      if (r.decision === ReviewDecision.APPROVED) a.reviewsApproved += 1;
    }

    for (const s of sessions) {
      const a = acc.get(s.userId);
      if (!a) continue;
      a.sessionDays.add(s.startedAt.toISOString().slice(0, 10));
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    for (const user of users) {
      const a = acc.get(user.id)!;

      const created = new Date(user.createdAt);
      created.setHours(0, 0, 0, 0);
      const workingDays = Math.max(
        1,
        Math.floor((todayStart.getTime() - created.getTime()) / MS_PER_DAY) + 1,
      );

      const completionRate = pct(a.completed, a.assigned);
      const approvalRate = pct(a.reviewsApproved, a.reviewsTotal);
      const revisionRate = pct(
        a.reviewsTotal - a.reviewsApproved,
        a.reviewsTotal,
      );
      const evidenceCompliance = pct(a.completedWithEvidence, a.completed);
      const workLogConsistency = pct(a.tasksWithWorkLog, a.assigned);
      const sessionConsistency = Math.min(
        100,
        pct(a.sessionDays.size, workingDays),
      );

      // Overall (internal saja) = rata-rata 5 metrik arah-positif.
      const overall =
        (completionRate +
          approvalRate +
          evidenceCompliance +
          workLogConsistency +
          sessionConsistency) /
        5;

      result.set(user.id, {
        completionRate,
        approvalRate,
        revisionRate,
        evidenceCompliance,
        workLogConsistency,
        sessionConsistency,
        status: statusFromOverall(overall),
        hasData: a.assigned > 0,
      });
    }

    return result;
  }
}
