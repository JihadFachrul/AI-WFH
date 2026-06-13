"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { tasksService } from "@/services/tasks.service";
import type { Paginated } from "@/types/api";
import type { Task, TaskStatus, TaskPriority } from "@/types/task";

const LIMIT = 100;

export interface KanbanFilters {
  search?: string;
  priority?: TaskPriority;
  assignedToId?: string;
}

/**
 * Kanban memakai Task API existing (GET /tasks). Board mengambil task lalu
 * dikelompokkan per-status di komponen. Filter (search/priority/assignee)
 * tetap dijalankan backend.
 */
export function useKanban(filters: KanbanFilters) {
  return useQuery({
    queryKey: ["kanban", filters],
    queryFn: () => tasksService.list({ ...filters, limit: LIMIT }),
    placeholderData: keepPreviousData,
  });
}

/**
 * Pindah kolom = ubah status via PATCH /tasks/:id (endpoint existing).
 * Optimistic update agar board responsif; rollback bila gagal (mis. 403).
 */
export function useMoveTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      tasksService.update(id, { status }),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ["kanban"] });
      const prev = qc.getQueriesData<Paginated<Task>>({ queryKey: ["kanban"] });
      qc.setQueriesData<Paginated<Task>>({ queryKey: ["kanban"] }, (old) =>
        old
          ? {
              ...old,
              data: old.data.map((t) =>
                t.id === id ? { ...t, status } : t,
              ),
            }
          : old,
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      ctx?.prev?.forEach(([key, data]) => qc.setQueryData(key, data));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["kanban"] }),
  });
}
