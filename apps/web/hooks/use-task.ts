"use client";

import { useQuery } from "@tanstack/react-query";
import { tasksService } from "@/services/tasks.service";

/** Detail satu task. */
export function useTask(id: string) {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => tasksService.get(id),
    enabled: !!id,
  });
}
