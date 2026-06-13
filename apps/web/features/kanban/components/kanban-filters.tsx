"use client";

import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { TaskPriority } from "@/types/task";

const SELECT_CLASS =
  "h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

interface Props {
  search: string;
  priority: TaskPriority | "";
  assignedToId: string;
  /** Tampilkan filter assignee (hanya MANAGER+ yang bisa list user). */
  canFilterAssignee: boolean;
  users: { id: string; name: string }[];
  onSearchChange: (v: string) => void;
  onPriorityChange: (v: TaskPriority | "") => void;
  onAssigneeChange: (v: string) => void;
}

export function KanbanFilters({
  search,
  priority,
  assignedToId,
  canFilterAssignee,
  users,
  onSearchChange,
  onPriorityChange,
  onAssigneeChange,
}: Props) {
  const [text, setText] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => onSearchChange(text), 350);
    return () => clearTimeout(timer);
  }, [text, onSearchChange]);

  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative sm:max-w-xs sm:flex-1">
        <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cari judul atau deskripsi…"
          className="pl-8"
        />
      </div>

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

      {canFilterAssignee && (
        <select
          value={assignedToId}
          onChange={(e) => onAssigneeChange(e.target.value)}
          className={SELECT_CLASS}
          aria-label="Filter assignee"
        >
          <option value="">Semua assignee</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
