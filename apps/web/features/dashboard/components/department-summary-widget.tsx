"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Department } from "@/types/department";

interface Props {
  departments: Department[];
  total: number;
  isLoading: boolean;
  isError: boolean;
}

export function DepartmentSummaryWidget({
  departments,
  total,
  isLoading,
  isError,
}: Props) {
  const items = departments.slice(0, 5);

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Department Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            Memuat…
          </p>
        ) : isError ? (
          <p className="px-4 py-8 text-center text-sm text-destructive">
            Gagal memuat departemen.
          </p>
        ) : items.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No departments found
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((d) => (
              <li key={d.id}>
                <Link
                  href={`/departments/${d.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent/50"
                >
                  <span className="truncate text-sm font-medium">{d.name}</span>
                  <span className="shrink-0 truncate text-xs text-muted-foreground">
                    {d.description ?? "—"}
                  </span>
                </Link>
              </li>
            ))}
            {total > items.length && (
              <li className="px-4 py-2 text-center text-xs text-muted-foreground">
                +{total - items.length} departemen lainnya
              </li>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
