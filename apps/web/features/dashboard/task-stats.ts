import type { Task, TaskStatus } from "@/types/task";

export interface TaskStats {
  pending: number;
  overdue: number;
  byStatus: Record<TaskStatus, number>;
}

const PENDING_STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "REVIEW"];
const CLOSED_STATUSES: TaskStatus[] = ["DONE", "CANCELLED"];

/**
 * Hitung statistik operasional dari kumpulan task yang sudah di-fetch.
 * Murni (tanpa I/O) — dipakai widget dashboard. `nowMs` di-pass agar mudah
 * diuji & deterministik.
 */
export function deriveTaskStats(tasks: Task[], nowMs: number): TaskStats {
  const byStatus: Record<TaskStatus, number> = {
    TODO: 0,
    IN_PROGRESS: 0,
    REVIEW: 0,
    DONE: 0,
    CANCELLED: 0,
  };

  let pending = 0;
  let overdue = 0;

  for (const task of tasks) {
    byStatus[task.status] += 1;

    if (PENDING_STATUSES.includes(task.status)) pending += 1;

    const isClosed = CLOSED_STATUSES.includes(task.status);
    if (task.dueDate && !isClosed) {
      if (new Date(task.dueDate).getTime() < nowMs) overdue += 1;
    }
  }

  return { pending, overdue, byStatus };
}
