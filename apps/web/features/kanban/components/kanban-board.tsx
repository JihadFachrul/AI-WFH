"use client";

import { useCallback, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { KanbanColumn } from "./kanban-column";
import { KanbanFilters } from "./kanban-filters";
import { useKanban, useMoveTask, type KanbanFilters as Filters } from "@/hooks/use-kanban";
import { useKanbanRealtime } from "@/hooks/use-kanban-realtime";
import { useUsers } from "@/hooks/use-users";
import { useAuthStore } from "@/stores/auth.store";
import { isPrivileged } from "@/lib/roles";
import type { Task, TaskStatus, TaskPriority } from "@/types/task";

const COLUMNS: TaskStatus[] = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];

export function KanbanBoard() {
  useKanbanRealtime();

  const role = useAuthStore((s) => s.user?.role);
  const currentUserId = useAuthStore((s) => s.user?.id);
  const canFilterAssignee = isPrivileged(role);

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<TaskPriority | "">("");
  const [assignedToId, setAssignedToId] = useState("");

  const filters: Filters = useMemo(
    () => ({
      search: search || undefined,
      priority: priority || undefined,
      assignedToId: assignedToId || undefined,
    }),
    [search, priority, assignedToId],
  );

  const { data, isLoading, isError, refetch, isPlaceholderData } =
    useKanban(filters);
  const move = useMoveTask();

  const { data: usersData } = useUsers({ page: 1, limit: 100 });
  const users = (usersData?.data ?? []).map((u) => ({ id: u.id, name: u.name }));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const canMove = useCallback(
    (task: Task) =>
      isPrivileged(role) || task.assignedToId === currentUserId,
    [role, currentUserId],
  );

  const tasks = useMemo(() => data?.data ?? [], [data]);
  const byStatus = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      TODO: [],
      IN_PROGRESS: [],
      REVIEW: [],
      DONE: [],
      CANCELLED: [],
    };
    for (const t of tasks) map[t.status]?.push(t);
    return map;
  }, [tasks]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const task = active.data.current?.task as Task | undefined;
    const newStatus = over.id as TaskStatus;
    if (!task || task.status === newStatus || !canMove(task)) return;
    move.mutate({ id: task.id, status: newStatus });
  };

  return (
    <div>
      <KanbanFilters
        search={search}
        priority={priority}
        assignedToId={assignedToId}
        canFilterAssignee={canFilterAssignee}
        users={users}
        onSearchChange={setSearch}
        onPriorityChange={setPriority}
        onAssigneeChange={setAssignedToId}
      />

      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto">
          {COLUMNS.map((c) => (
            <div key={c} className="w-72 shrink-0 space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between gap-3">
            <span>Gagal memuat board.</span>
            <button
              type="button"
              onClick={() => refetch()}
              className="font-medium underline"
            >
              Coba lagi
            </button>
          </AlertDescription>
        </Alert>
      ) : (
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
          <div
            className={
              isPlaceholderData
                ? "flex gap-4 overflow-x-auto pb-4 opacity-60 transition-opacity"
                : "flex gap-4 overflow-x-auto pb-4"
            }
          >
            {COLUMNS.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={byStatus[status]}
                canMove={canMove}
              />
            ))}
          </div>
        </DndContext>
      )}
    </div>
  );
}
