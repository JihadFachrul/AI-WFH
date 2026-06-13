"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { KanbanCard } from "./kanban-card";
import type { Task, TaskStatus } from "@/types/task";

const COLUMN_LABEL: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  DONE: "Done",
  CANCELLED: "Cancelled",
};

interface Props {
  status: TaskStatus;
  tasks: Task[];
  canMove: (task: Task) => boolean;
}

export function KanbanColumn({ status, tasks, canMove }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-xl bg-muted/40">
      <div className="flex items-center justify-between px-3 py-2.5">
        <span className="text-sm font-semibold">{COLUMN_LABEL[status]}</span>
        <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex max-h-[calc(100vh-16rem)] flex-1 flex-col gap-2 overflow-y-auto rounded-lg p-2 transition-colors",
          isOver && "bg-accent/60 ring-2 ring-primary/30",
        )}
      >
        {tasks.length === 0 ? (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            Tidak ada task pada kolom ini.
          </p>
        ) : (
          tasks.map((task) => (
            <KanbanCard key={task.id} task={task} canMove={canMove(task)} />
          ))
        )}
      </div>
    </div>
  );
}
