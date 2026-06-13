"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CalendarIcon, GripVerticalIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskPriorityBadge } from "@/features/tasks/components/task-badges";
import type { Task } from "@/types/task";

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface Props {
  task: Task;
  /** Boleh dipindahkan (assignee atau manager/admin). */
  canMove: boolean;
}

export function KanbanCard({ task, canMove }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id, data: { task }, disabled: !canMove });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow",
        isDragging && "opacity-50",
        canMove ? "hover:shadow-md" : "opacity-90",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug">{task.title}</p>
        {canMove && (
          <button
            type="button"
            className="shrink-0 cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
            aria-label="Geser kartu"
            {...attributes}
            {...listeners}
          >
            <GripVerticalIcon className="size-4" />
          </button>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <TaskPriorityBadge priority={task.priority} />
        {task.dueDate && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarIcon className="size-3" />
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        {task.assignedTo ? (
          <>
            <span className="flex size-5 items-center justify-center rounded-full bg-secondary text-[9px] font-semibold text-secondary-foreground">
              {initials(task.assignedTo.name)}
            </span>
            {task.assignedTo.name}
          </>
        ) : (
          <span>Tidak ditugaskan</span>
        )}
      </div>
    </div>
  );
}
