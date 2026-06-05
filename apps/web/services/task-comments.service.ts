import { api } from "@/lib/api";
import type { Paginated } from "@/types/api";
import type { TaskComment } from "@/types/comment";

export const taskCommentsService = {
  list: async (
    taskId: string,
    params?: { page?: number; limit?: number },
  ): Promise<Paginated<TaskComment>> => {
    const { data } = await api.get<Paginated<TaskComment>>(
      `/tasks/${taskId}/comments`,
      { params },
    );
    return data;
  },

  create: async (taskId: string, content: string): Promise<TaskComment> => {
    const { data } = await api.post<TaskComment>(`/tasks/${taskId}/comments`, {
      content,
    });
    return data;
  },
};
