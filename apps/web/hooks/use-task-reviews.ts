"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskReviewsService } from "@/services/task-reviews.service";
import type { CreateReviewPayload } from "@/types/review";

export function useTaskReviews(taskId: string) {
  return useQuery({
    queryKey: ["task-reviews", taskId],
    queryFn: () => taskReviewsService.getReviews(taskId),
    enabled: !!taskId,
  });
}

export function useSubmitReview(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => taskReviewsService.submitForReview(taskId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["task", taskId] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useCreateReview(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      taskReviewsService.createReview(taskId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["task-reviews", taskId] });
      qc.invalidateQueries({ queryKey: ["task", taskId] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
