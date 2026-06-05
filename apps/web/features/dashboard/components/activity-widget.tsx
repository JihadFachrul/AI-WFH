"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Notification } from "@/types/notification";

interface Props {
  notifications: Notification[];
  isLoading: boolean;
  isError: boolean;
}

/**
 * Recent Activity: memakai notifikasi terbaru sebagai feed aktivitas
 * (notifikasi sudah merepresentasikan task assigned/updated/comment).
 */
export function ActivityWidget({ notifications, isLoading, isError }: Props) {
  const items = notifications.slice(0, 5);

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            Memuat…
          </p>
        ) : isError ? (
          <p className="px-4 py-8 text-center text-sm text-destructive">
            Gagal memuat aktivitas.
          </p>
        ) : items.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No recent activity
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((n) => (
              <li key={n.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">
                    {n.title}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                  {n.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
