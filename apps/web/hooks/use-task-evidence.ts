"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskEvidenceService } from "@/services/task-evidence.service";

export function useTaskEvidence(taskId: string) {
  return useQuery({
    queryKey: ["task-evidence", taskId],
    queryFn: () => taskEvidenceService.getTaskEvidence(taskId),
    enabled: !!taskId,
  });
}

export function useUploadEvidence(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { file: File; description?: string }) =>
      taskEvidenceService.uploadEvidence(taskId, vars.file, vars.description),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["task-evidence", taskId] }),
  });
}

export function useDeleteEvidence(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (evidenceId: string) =>
      taskEvidenceService.deleteEvidence(taskId, evidenceId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["task-evidence", taskId] }),
  });
}
