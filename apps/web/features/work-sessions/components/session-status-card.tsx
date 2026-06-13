"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentSession } from "@/hooks/use-work-sessions";
import { StartSessionButton } from "./start-session-button";
import { EndSessionButton } from "./end-session-button";
import { formatDuration, timeHHmm } from "../lib/format";

export function SessionStatusCard() {
  const { data: session, isLoading, isError, refetch } = useCurrentSession();

  // Ticker agar durasi hidup ter-update tiap 30 detik.
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!session) return;
    const t = setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(t);
  }, [session]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sesi Kerja</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-28" />
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between gap-3">
              <span>Gagal memuat sesi kerja.</span>
              <button
                type="button"
                onClick={() => refetch()}
                className="font-medium underline"
              >
                Coba lagi
              </button>
            </AlertDescription>
          </Alert>
        ) : session ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="size-2.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-emerald-700">
                Working Now
              </span>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-xs text-muted-foreground">Started</p>
                <p className="text-sm font-medium tabular-nums">
                  {timeHHmm(session.startedAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium tabular-nums">
                  {formatDuration(
                    (Date.now() - new Date(session.startedAt).getTime()) /
                      60000,
                  )}
                </p>
              </div>
            </div>
            <EndSessionButton />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-slate-300" />
              <span className="text-sm font-medium text-muted-foreground">
                Not Working
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Belum memulai sesi kerja hari ini.
            </p>
            <StartSessionButton />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
