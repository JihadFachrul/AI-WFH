"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskEvidenceService } from "@/services/task-evidence.service";

export function useCompletionNote(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (note: string) =>
      taskEvidenceService.updateCompletionNote(taskId, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["task", taskId] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
