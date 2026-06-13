import { api } from "@/lib/api";
import type { TaskReview, CreateReviewPayload } from "@/types/review";
import type { Task } from "@/types/task";

export const taskReviewsService = {
  getReviews: async (taskId: string): Promise<TaskReview[]> => {
    const { data } = await api.get<TaskReview[]>(`/tasks/${taskId}/reviews`);
    return data;
  },

  submitForReview: async (taskId: string): Promise<Task> => {
    const { data } = await api.post<Task>(`/tasks/${taskId}/submit-review`);
    return data;
  },

  createReview: async (
    taskId: string,
    payload: CreateReviewPayload,
  ): Promise<TaskReview> => {
    const { data } = await api.post<TaskReview>(
      `/tasks/${taskId}/reviews`,
      payload,
    );
    return data;
  },
};
