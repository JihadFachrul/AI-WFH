"use client";

import Link from "next/link";
import { BellIcon, InboxIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { NotificationItem } from "@/features/notifications/components/notification-item";
import {
  useNotifications,
  useUnreadNotifications,
} from "@/hooks/use-notifications";
import {
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/use-notification-mutations";

/**
 * Dropdown notifikasi di header: badge unread (dari backend), daftar terbaru,
 * mark-as-read saat diklik, dan mark-all. Realtime ditangani useNotificationRealtime
 * di Header (invalidate query → komponen ini ikut ter-refresh).
 */
export function NotificationDropdown() {
  const { data, isLoading, isError } = useNotifications(8);
  const { data: unread } = useUnreadNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const notifications = data?.data ?? [];
  const unreadCount = unread?.meta.total ?? 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-4 text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuLabel className="flex items-center justify-between px-3 py-2">
          <span>Notifikasi</span>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markAll.mutate()}
              disabled={markAll.isPending}
              className="text-xs font-normal text-primary hover:underline disabled:opacity-50"
            >
              Tandai semua dibaca
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-0" />

        <div className="max-h-80 overflow-y-auto p-1">
          {isLoading && (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">
              Memuat…
            </p>
          )}
          {isError && (
            <p className="px-3 py-6 text-center text-xs text-destructive">
              Gagal memuat notifikasi.
            </p>
          )}
          {!isLoading && !isError && notifications.length === 0 && (
            <div className="flex flex-col items-center gap-1 px-3 py-6 text-center">
              <InboxIcon className="size-5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                No notifications yet
              </p>
            </div>
          )}
          {!isLoading &&
            !isError &&
            notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onMarkRead={(id) => markRead.mutate(id)}
                dense
              />
            ))}
        </div>

        <DropdownMenuSeparator className="my-0" />
        <Link
          href="/notifications"
          className="block px-3 py-2 text-center text-xs font-medium text-primary hover:underline"
        >
          Lihat semua notifikasi
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
