"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksService } from "@/services/tasks.service";
import type { UpdateTaskPayload } from "@/types/task";

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: tasksService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTaskPayload) => tasksService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["task", id] });
    },
  });
}
