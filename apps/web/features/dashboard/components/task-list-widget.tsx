"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TaskStatusBadge,
  TaskPriorityBadge,
} from "@/features/tasks/components/task-badges";
import type { Task } from "@/types/task";

interface Props {
  title: string;
  tasks: Task[];
  isLoading: boolean;
  isError: boolean;
  emptyLabel: string;
}

/** Widget daftar task (maksimal 5 item). */
export function TaskListWidget({
  title,
  tasks,
  isLoading,
  isError,
  emptyLabel,
}: Props) {
  const items = tasks.slice(0, 5);

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            Memuat…
          </p>
        ) : isError ? (
          <p className="px-4 py-8 text-center text-sm text-destructive">
            Gagal memuat task.
          </p>
        ) : items.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            {emptyLabel}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((task) => (
              <li key={task.id}>
                <Link
                  href={`/tasks/${task.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent/50"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {task.title}
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <TaskPriorityBadge priority={task.priority} />
                    <TaskStatusBadge status={task.status} />
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
