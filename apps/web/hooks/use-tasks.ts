"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { tasksService } from "@/services/tasks.service";
import type { TaskFilters } from "@/types/task";

/** Daftar task ter-paginasi. Filter/search/pagination dilakukan di backend. */
export function useTasks(filters: TaskFilters) {
  return useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => tasksService.list(filters),
    placeholderData: keepPreviousData,
  });
}
