"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KpiStatusBadge } from "./kpi-status-badge";
import { useTeamKpi } from "@/hooks/use-kpi";

export function TeamKpiTable() {
  const { data, isLoading, isError, refetch } = useTeamKpi();
  const members = data ?? [];

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Team Performance</CardTitle>
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
                <span>Gagal memuat KPI tim.</span>
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
        ) : members.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            Belum cukup data untuk menghitung KPI.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Completion</TableHead>
                <TableHead className="text-right">Approval</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>
                    {m.kpi.hasData ? (
                      <KpiStatusBadge status={m.kpi.status} />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Belum ada data
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {m.kpi.hasData ? `${m.kpi.completionRate}%` : "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {m.kpi.hasData ? `${m.kpi.approvalRate}%` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
