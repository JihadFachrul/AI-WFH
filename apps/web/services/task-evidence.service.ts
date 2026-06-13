import { api } from "@/lib/api";
import type { TaskEvidence } from "@/types/evidence";
import type { Task } from "@/types/task";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

/** Origin untuk file statis (/uploads/...) = API URL tanpa suffix /api. */
export const FILE_BASE_URL = API_URL.replace(/\/api\/?$/, "");

export const taskEvidenceService = {
  getTaskEvidence: async (taskId: string): Promise<TaskEvidence[]> => {
    const { data } = await api.get<TaskEvidence[]>(
      `/tasks/${taskId}/evidence`,
    );
    return data;
  },

  uploadEvidence: async (
    taskId: string,
    file: File,
    description?: string,
  ): Promise<TaskEvidence> => {
    const form = new FormData();
    form.append("file", file);
    if (description) form.append("description", description);
    // FormData → axios set multipart/form-data + boundary otomatis.
    const { data } = await api.post<TaskEvidence>(
      `/tasks/${taskId}/evidence`,
      form,
    );
    return data;
  },

  deleteEvidence: async (
    taskId: string,
    evidenceId: string,
  ): Promise<{ id: string; deleted: true }> => {
    const { data } = await api.delete<{ id: string; deleted: true }>(
      `/tasks/${taskId}/evidence/${evidenceId}`,
    );
    return data;
  },

  updateCompletionNote: async (
    taskId: string,
    completionNote: string,
  ): Promise<Task> => {
    const { data } = await api.patch<Task>(
      `/tasks/${taskId}/completion-note`,
      { completionNote },
    );
    return data;
  },
};
