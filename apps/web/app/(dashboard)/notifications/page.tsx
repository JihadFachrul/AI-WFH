"use client";

import { CheckCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/components/shared/data-states";
import { NotificationItem } from "@/features/notifications/components/notification-item";
import {
  useNotifications,
  useUnreadNotifications,
} from "@/hooks/use-notifications";
import {
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/use-notification-mutations";

export default function NotificationsPage() {
  const { data, isLoading, isError, refetch } = useNotifications(50);
  const { data: unread } = useUnreadNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const notifications = data?.data ?? [];
  const unreadCount = unread?.meta.total ?? 0;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-start justify-between">
        <PageHeader
          title="Notifications"
          description={
            unreadCount > 0
              ? `${unreadCount} belum dibaca`
              : "Semua pemberitahuan untuk akun Anda."
          }
        />
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAll.mutate()}
            disabled={markAll.isPending}
          >
            <CheckCheckIcon className="size-4" />
            {markAll.isPending ? "Memproses…" : "Tandai semua dibaca"}
          </Button>
        )}
      </div>

      {isLoading ? (
        <LoadingState label="Memuat notifikasi…" />
      ) : isError ? (
        <ErrorState label="Gagal memuat notifikasi." onRetry={() => refetch()} />
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No notifications yet"
          description="Pemberitahuan task & komentar akan tampil di sini."
        />
      ) : (
        <div className="divide-y divide-border rounded-xl bg-card ring-1 ring-foreground/10">
          {notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={(id) => markRead.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
