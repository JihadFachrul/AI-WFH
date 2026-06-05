"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskStatusBadge } from "@/features/tasks/components/task-badges";
import type { TaskStatus } from "@/types/task";

const ORDER: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
  "CANCELLED",
];

interface Props {
  byStatus: Record<TaskStatus, number>;
  isLoading: boolean;
  isError: boolean;
}

export function TasksByStatusWidget({ byStatus, isLoading, isError }: Props) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Tasks by Status</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Memuat…
          </p>
        ) : isError ? (
          <p className="py-6 text-center text-sm text-destructive">
            Gagal memuat data.
          </p>
        ) : (
          <ul className="space-y-2">
            {ORDER.map((status) => (
              <li key={status} className="flex items-center justify-between">
                <TaskStatusBadge status={status} />
                <span className="text-sm font-semibold tabular-nums">
                  {byStatus[status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
