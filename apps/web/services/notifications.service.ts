import { api } from "@/lib/api";
import type { Paginated } from "@/types/api";
import type { Notification } from "@/types/notification";

interface PageParams {
  page?: number;
  limit?: number;
}

export const notificationsService = {
  list: async (params?: PageParams): Promise<Paginated<Notification>> => {
    const { data } = await api.get<Paginated<Notification>>("/notifications", {
      params,
    });
    return data;
  },

  listUnread: async (params?: PageParams): Promise<Paginated<Notification>> => {
    const { data } = await api.get<Paginated<Notification>>(
      "/notifications/unread",
      { params },
    );
    return data;
  },

  markAllRead: async (): Promise<{ updated: number }> => {
    const { data } = await api.patch<{ updated: number }>(
      "/notifications/read-all",
    );
    return data;
  },

  markRead: async (id: string): Promise<Notification> => {
    const { data } = await api.patch<Notification>(`/notifications/${id}/read`);
    return data;
  },
};
