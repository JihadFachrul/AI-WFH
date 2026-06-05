"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskCommentsService } from "@/services/task-comments.service";

export function useTaskComments(taskId: string) {
  return useQuery({
    queryKey: ["task-comments", taskId],
    queryFn: () => taskCommentsService.list(taskId, { limit: 50 }),
    enabled: !!taskId,
  });
}

export function useAddComment(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      taskCommentsService.create(taskId, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["task-comments", taskId] });
    },
  });
}
