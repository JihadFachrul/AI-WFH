import { api } from "@/lib/api";
import type { WorkLog, CreateWorkLogPayload } from "@/types/work-log";

export const workLogsService = {
  getWorkLogs: async (taskId: string): Promise<WorkLog[]> => {
    const { data } = await api.get<WorkLog[]>(`/tasks/${taskId}/work-logs`);
    return data;
  },

  createWorkLog: async (
    taskId: string,
    payload: CreateWorkLogPayload,
  ): Promise<WorkLog> => {
    const { data } = await api.post<WorkLog>(
      `/tasks/${taskId}/work-logs`,
      payload,
    );
    return data;
  },

  deleteWorkLog: async (
    taskId: string,
    workLogId: string,
  ): Promise<{ id: string; deleted: true }> => {
    const { data } = await api.delete<{ id: string; deleted: true }>(
      `/tasks/${taskId}/work-logs/${workLogId}`,
    );
    return data;
  },
};
