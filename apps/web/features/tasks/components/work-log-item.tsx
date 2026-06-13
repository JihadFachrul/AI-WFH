"use client";

import { AlertTriangleIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkLog } from "@/types/work-log";

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface Props {
  workLog: WorkLog;
  canDelete: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  /** Sembunyikan garis penghubung di item terakhir. */
  isLast: boolean;
}

/** Satu titik pada timeline progress (gaya activity feed, jam menonjol). */
export function WorkLogItem({
  workLog,
  canDelete,
  onDelete,
  isDeleting,
  isLast,
}: Props) {
  const { id, activity, progress, blocker, createdAt, user } = workLog;
  const date = new Date(createdAt);
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const day = date.toLocaleDateString();

  return (
    <li className="relative flex gap-3 pb-5 last:pb-0">
      {/* Garis penghubung timeline */}
      {!isLast && (
        <span
          className="absolute left-[5px] top-4 bottom-0 w-px bg-border"
          aria-hidden
        />
      )}

      {/* Node titik timeline */}
      <span
        className="z-10 mt-1.5 size-2.5 shrink-0 rounded-full bg-primary ring-4 ring-card"
        aria-hidden
      />

      <div className="min-w-0 flex-1">
        {/* Jam menonjol + tanggal + author */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold tabular-nums">{time}</span>
            <span className="text-xs text-muted-foreground">{day}</span>
          </div>
          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(id)}
              disabled={isDeleting}
              aria-label="Hapus log"
              className="text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
            >
              <Trash2Icon className="size-4" />
            </button>
          )}
        </div>

        <p className="mt-1 text-sm text-foreground/90">{activity}</p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <span className="flex size-4 items-center justify-center rounded-full bg-secondary text-[9px] font-semibold text-secondary-foreground">
              {initials(user.name)}
            </span>
            {user.name}
          </span>
          {progress !== null && (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                progress >= 100
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-indigo-100 text-indigo-700",
              )}
            >
              Progress {progress}%
            </span>
          )}
          {blocker && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
              <AlertTriangleIcon className="size-3" />
              {blocker}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}
