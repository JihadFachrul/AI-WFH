"use client";

import Link from "next/link";
import { CalendarClockIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useTodayMeetings } from "@/hooks/use-meetings";
import { useMeetingRealtime } from "@/hooks/use-meeting-realtime";
import { formatTimeRange } from "../lib/datetime";

export function TodayMeetingsWidget() {
  useMeetingRealtime();
  const { data, isLoading, isError, refetch } = useTodayMeetings();
  const meetings = data ?? [];

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Today&rsquo;s Meetings</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {[0, 1].map((i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertDescription className="flex items-center justify-between gap-3">
                <span>Gagal memuat meeting.</span>
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
        ) : meetings.length === 0 ? (
          <div className="flex flex-col items-center gap-1 px-4 py-8 text-center">
            <CalendarClockIcon className="size-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Belum ada meeting hari ini.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {meetings.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/meetings/${m.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent/50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{m.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.participants.length} peserta · {m.createdBy.name}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {formatTimeRange(m.startAt, m.endAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
