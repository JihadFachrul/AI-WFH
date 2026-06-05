"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TaskStatusBadge, TaskPriorityBadge } from "./task-badges";
import type { Task } from "@/types/task";

function formatDate(value: string | null): string {
  return value ? new Date(value).toLocaleDateString() : "—";
}

export function TaskTable({ tasks }: { tasks: Task[] }) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              className="cursor-pointer"
              onClick={() => router.push(`/tasks/${task.id}`)}
            >
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell>
                <TaskStatusBadge status={task.status} />
              </TableCell>
              <TableCell>
                <TaskPriorityBadge priority={task.priority} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {task.assignedTo?.name ?? "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(task.dueDate)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
