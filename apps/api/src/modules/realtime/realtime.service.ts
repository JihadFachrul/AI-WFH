import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';

/** Payload event realtime (bentuk minimal & stabil untuk client). */
export interface RealtimeNotification {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
}

export interface RealtimeTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignedToId: string | null;
  createdById: string;
}

export interface RealtimeComment {
  id: string;
  taskId: string;
  content: string;
  authorId: string;
  createdAt: Date;
}

/** Format room per-user yang konsisten dipakai seluruh aplikasi. */
export function userRoom(userId: string): string {
  return `user:${userId}`;
}

/**
 * RealtimeService = pusat logika realtime:
 * - menyimpan instance Socket.IO Server (di-bind oleh gateway saat init)
 * - melacak user online in-memory (tanpa Redis/DB)
 * - menyediakan emit method yang reusable (tidak ada emit tersebar di service lain)
 *
 * Semua emit aman: jika server belum ter-bind, hanya di-log dan dilewati
 * (tidak pernah melempar exception ke alur bisnis).
 */
@Injectable()
export class RealtimeService {
  private readonly logger = new Logger(RealtimeService.name);

  private server: Server | null = null;

  /** userId -> set socketId (satu user bisa banyak koneksi/tab). */
  private readonly online = new Map<string, Set<string>>();

  /** Dipanggil gateway pada afterInit. */
  bindServer(server: Server): void {
    this.server = server;
  }

  // ============================================================
  // Online tracking (in-memory) — reusable helpers
  // ============================================================

  addOnline(userId: string, socketId: string): void {
    const sockets = this.online.get(userId) ?? new Set<string>();
    sockets.add(socketId);
    this.online.set(userId, sockets);
  }

  removeOnline(userId: string, socketId: string): void {
    const sockets = this.online.get(userId);
    if (!sockets) return;
    sockets.delete(socketId);
    if (sockets.size === 0) {
      this.online.delete(userId);
    }
  }

  isOnline(userId: string): boolean {
    return this.online.has(userId);
  }

  getOnlineUserIds(): string[] {
    return [...this.online.keys()];
  }

  getOnlineCount(): number {
    return this.online.size;
  }

  // ============================================================
  // Emit (reusable, terpusat)
  // ============================================================

  /** Emit generik ke room satu user. */
  emitToUser(userId: string, event: string, payload: unknown): void {
    if (!this.server) {
      this.logger.warn(`Server belum siap; lewati emit "${event}"`);
      return;
    }
    this.server.to(userRoom(userId)).emit(event, payload);
  }

  /** Emit ke beberapa user unik sekaligus. */
  emitToUsers(userIds: string[], event: string, payload: unknown): void {
    for (const userId of new Set(userIds)) {
      this.emitToUser(userId, event, payload);
    }
  }

  // --- semantic wrappers (naming event konsisten) ---

  emitNotification(userId: string, payload: RealtimeNotification): void {
    this.emitToUser(userId, 'notification:new', payload);
  }

  emitTaskAssigned(userId: string, task: RealtimeTask): void {
    this.emitToUser(userId, 'task:assigned', task);
  }

  emitTaskUpdated(userIds: string[], task: RealtimeTask): void {
    this.emitToUsers(userIds, 'task:updated', task);
  }

  emitTaskComment(userIds: string[], comment: RealtimeComment): void {
    this.emitToUsers(userIds, 'task:comment', comment);
  }
}
