"use client";

import { cn } from "@/lib/utils";
import type { Notification } from "@/types/notification";

interface Props {
  notification: Notification;
  onMarkRead?: (id: string) => void;
  dense?: boolean;
}

/**
 * Baris notifikasi reusable (dipakai di dropdown & halaman center).
 * Klik notifikasi yang belum dibaca → tandai sebagai dibaca.
 */
export function NotificationItem({ notification, onMarkRead, dense }: Props) {
  const { id, title, message, isRead, createdAt } = notification;

  const handleClick = () => {
    if (!isRead) onMarkRead?.(id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isRead}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg px-3 text-left transition-colors",
        dense ? "py-2" : "py-3",
        isRead ? "cursor-default" : "cursor-pointer hover:bg-accent",
        !isRead && !dense && "bg-accent/40",
      )}
    >
      <span
        className={cn(
          "mt-1.5 size-2 shrink-0 rounded-full",
          isRead ? "bg-border" : "bg-primary",
        )}
        aria-hidden
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "truncate text-sm",
              isRead ? "font-medium text-foreground" : "font-semibold",
            )}
          >
            {title}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {new Date(createdAt).toLocaleString()}
          </span>
        </span>
        <span
          className={cn(
            "mt-0.5 block text-sm text-muted-foreground",
            dense && "line-clamp-2",
          )}
        >
          {message}
        </span>
      </span>
    </button>
  );
}
