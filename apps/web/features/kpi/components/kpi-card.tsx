"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { KpiStatusBadge } from "./kpi-status-badge";
import { useMyKpi } from "@/hooks/use-kpi";
import { cn } from "@/lib/utils";

const METRICS = [
  { key: "completionRate", label: "Task Completion" },
  { key: "approvalRate", label: "Approval Rate" },
  { key: "evidenceCompliance", label: "Evidence Compliance" },
  { key: "workLogConsistency", label: "Work Log Consistency" },
  { key: "sessionConsistency", label: "Session Consistency" },
] as const;

function barColor(value: number): string {
  if (value >= 85) return "bg-emerald-500";
  if (value >= 70) return "bg-indigo-500";
  return "bg-amber-500";
}

export function KpiCard() {
  const { data: kpi, isLoading, isError, refetch } = useMyKpi();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between border-b">
        <CardTitle>My Performance</CardTitle>
        {kpi?.hasData && <KpiStatusBadge status={kpi.status} />}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between gap-3">
              <span>Gagal memuat KPI.</span>
              <button
                type="button"
                onClick={() => refetch()}
                className="font-medium underline"
              >
                Coba lagi
              </button>
            </AlertDescription>
          </Alert>
        ) : !kpi || !kpi.hasData ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Belum cukup data untuk menghitung KPI.
          </p>
        ) : (
          <ul className="space-y-3">
            {METRICS.map((m) => {
              const value = kpi[m.key];
              return (
                <li key={m.key} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="font-semibold tabular-nums">{value}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full", barColor(value))}
                      style={{ width: `${value}%` }}
                    />
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
