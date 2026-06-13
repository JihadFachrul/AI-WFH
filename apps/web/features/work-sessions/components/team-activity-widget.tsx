"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeamSessions, useSessionRealtime } from "@/hooks/use-work-sessions";
import { timeHHmm } from "../lib/format";

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TeamActivityWidget() {
  useSessionRealtime();
  const { data, isLoading, isError, refetch } = useTeamSessions();

  const members = data ?? [];
  const working = members.filter((m) => m.activeSession);
  const offline = members.filter((m) => !m.activeSession);

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Team Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-7 rounded-full" />
                <Skeleton className="h-3 w-40" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertDescription className="flex items-center justify-between gap-3">
                <span>Gagal memuat aktivitas tim.</span>
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
        ) : working.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            Belum ada anggota tim yang aktif.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {[...working, ...offline].map((m) => {
              const isWorking = !!m.activeSession;
              return (
                <li key={m.id} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                    {initials(m.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{m.name}</p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span
                        className={
                          isWorking
                            ? "size-1.5 rounded-full bg-emerald-500"
                            : "size-1.5 rounded-full bg-slate-300"
                        }
                      />
                      {isWorking
                        ? `Working · Started ${timeHHmm(m.activeSession!.startedAt)}`
                        : "Offline"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
