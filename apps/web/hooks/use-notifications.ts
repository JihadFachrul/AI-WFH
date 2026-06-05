"use client";

import { useQuery } from "@tanstack/react-query";
import { notificationsService } from "@/services/notifications.service";

/** Semua notifikasi milik user, terbaru dahulu (backend sudah urut DESC). */
export function useNotifications(limit = 50) {
  return useQuery({
    queryKey: ["notifications", "list", { limit }],
    queryFn: () => notificationsService.list({ limit }),
  });
}

/**
 * Notifikasi belum dibaca. Dipakai untuk badge unread di header —
 * `meta.total` mencerminkan jumlah unread sebenarnya dari backend.
 */
export function useUnreadNotifications(limit = 50) {
  return useQuery({
    queryKey: ["notifications", "unread", { limit }],
    queryFn: () => notificationsService.listUnread({ limit }),
  });
}
