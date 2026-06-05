import { api } from "@/lib/api";
import type { Paginated } from "@/types/api";
import type {
  Task,
  TaskFilters,
  CreateTaskPayload,
  UpdateTaskPayload,
} from "@/types/task";

export const tasksService = {
  list: async (filters?: TaskFilters): Promise<Paginated<Task>> => {
    const { data } = await api.get<Paginated<Task>>("/tasks", {
      params: filters,
    });
    return data;
  },

  get: async (id: string): Promise<Task> => {
    const { data } = await api.get<Task>(`/tasks/${id}`);
    return data;
  },

  create: async (payload: CreateTaskPayload): Promise<Task> => {
    const { data } = await api.post<Task>("/tasks", payload);
    return data;
  },

  update: async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
    const { data } = await api.patch<Task>(`/tasks/${id}`, payload);
    return data;
  },
};
