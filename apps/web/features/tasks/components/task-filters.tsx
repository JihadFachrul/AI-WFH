"use client";

import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { TaskStatus, TaskPriority } from "@/types/task";

const SELECT_CLASS =
  "h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const STATUSES: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
  "CANCELLED",
];
const PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

interface Props {
  search: string;
  status: TaskStatus | "";
  priority: TaskPriority | "";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TaskStatus | "") => void;
  onPriorityChange: (value: TaskPriority | "") => void;
}

export function TaskFilters({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}: Props) {
  // Search di-debounce supaya tidak request per ketukan; filter tetap di backend.
  const [text, setText] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => onSearchChange(text), 350);
    return () => clearTimeout(timer);
  }, [text, onSearchChange]);

  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cari judul atau deskripsi…"
          className="pl-8"
        />
      </div>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as TaskStatus | "")}
        className={SELECT_CLASS}
        aria-label="Filter status"
      >
        <option value="">Semua status</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value as TaskPriority | "")}
        className={SELECT_CLASS}
        aria-label="Filter priority"
      >
        <option value="">Semua priority</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  );
}
