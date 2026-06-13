"use client";

import Link from "next/link";
import { CalendarRangeIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { TypeBadge } from "./type-badge";
import { formatDate, formatTime } from "../lib/datetime";
import { useUpcomingEvents } from "@/hooks/use-calendar";
import { useCalendarRealtime } from "@/hooks/use-calendar-realtime";

/** Widget dashboard: maksimal 5 event mendatang (Meeting + CalendarEvent). */
export function UpcomingEventsWidget() {
  useCalendarRealtime();
  const { data, isLoading, isError, refetch } = useUpcomingEvents(5);
  const items = data ?? [];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between border-b">
        <CardTitle>Upcoming Events</CardTitle>
        <Link
          href="/calendar"
          className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground hover:text-foreground"
        >
          Kalender →
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertDescription className="flex items-center justify-between gap-3">
                <span>Gagal memuat event.</span>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="font-medium underline"
                >
                  Coba lagi
                </button>
              </AlertDescription>
            </Alert>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-1 px-4 py-8 text-center">
            <CalendarRangeIcon className="size-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Belum ada event mendatang.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li
                key={`${item.source}-${item.id}`}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <TypeBadge type={item.type} />
                    <span className="text-xs text-muted-foreground">
                      {item.organizer.name}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-medium">
                    {formatDate(item.startAt)}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {formatTime(item.startAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
