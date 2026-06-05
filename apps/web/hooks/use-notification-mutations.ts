"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "@/services/notifications.service";

/** Invalidate seluruh query notifikasi (list + unread) sekaligus. */
function useInvalidateNotifications() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["notifications"] });
}

export function useMarkNotificationRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: invalidate,
  });
}

export function useMarkAllNotificationsRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: () => notificationsService.markAllRead(),
    onSuccess: invalidate,
  });
}
