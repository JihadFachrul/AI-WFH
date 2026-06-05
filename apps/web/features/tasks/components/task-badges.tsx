import { cn } from "@/lib/utils";
import type { TaskStatus, TaskPriority } from "@/types/task";

const STATUS_STYLES: Record<TaskStatus, string> = {
  TODO: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-indigo-100 text-indigo-700",
  REVIEW: "bg-amber-100 text-amber-700",
  DONE: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-rose-100 text-rose-700",
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  DONE: "Done",
  CANCELLED: "Cancelled",
};

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-sky-100 text-sky-700",
  HIGH: "bg-amber-100 text-amber-700",
  CRITICAL: "bg-rose-100 text-rose-700",
};

function Pill({ className, children }: { className: string; children: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <Pill className={STATUS_STYLES[status]}>{STATUS_LABEL[status]}</Pill>;
}

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return <Pill className={PRIORITY_STYLES[priority]}>{priority}</Pill>;
}
