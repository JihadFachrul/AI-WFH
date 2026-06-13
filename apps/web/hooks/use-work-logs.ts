"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { workLogsService } from "@/services/work-logs.service";
import type { CreateWorkLogPayload } from "@/types/work-log";

export function useWorkLogs(taskId: string) {
  return useQuery({
    queryKey: ["work-logs", taskId],
    queryFn: () => workLogsService.getWorkLogs(taskId),
    enabled: !!taskId,
  });
}

export function useCreateWorkLog(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateWorkLogPayload) =>
      workLogsService.createWorkLog(taskId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["work-logs", taskId] }),
  });
}

export function useDeleteWorkLog(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (workLogId: string) =>
      workLogsService.deleteWorkLog(taskId, workLogId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["work-logs", taskId] }),
  });
}
