import { api } from "@/lib/api";
import type { Paginated } from "@/types/api";
import type {
  Meeting,
  MeetingFilters,
  CreateMeetingPayload,
  UpdateMeetingPayload,
} from "@/types/meeting";

export const meetingsService = {
  list: async (filters?: MeetingFilters): Promise<Paginated<Meeting>> => {
    const { data } = await api.get<Paginated<Meeting>>("/meetings", {
      params: filters,
    });
    return data;
  },

  today: async (): Promise<Meeting[]> => {
    const { data } = await api.get<Meeting[]>("/meetings/today");
    return data;
  },

  get: async (id: string): Promise<Meeting> => {
    const { data } = await api.get<Meeting>(`/meetings/${id}`);
    return data;
  },

  create: async (payload: CreateMeetingPayload): Promise<Meeting> => {
    const { data } = await api.post<Meeting>("/meetings", payload);
    return data;
  },

  update: async (
    id: string,
    payload: UpdateMeetingPayload,
  ): Promise<Meeting> => {
    const { data } = await api.patch<Meeting>(`/meetings/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<{ id: string; deleted: true }> => {
    const { data } = await api.delete<{ id: string; deleted: true }>(
      `/meetings/${id}`,
    );
    return data;
  },
};
