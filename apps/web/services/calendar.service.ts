import { api } from "@/lib/api";
import type { Paginated } from "@/types/api";
import type {
  CalendarEvent,
  CalendarEventFilters,
  CalendarItem,
  CreateCalendarEventPayload,
  UpdateCalendarEventPayload,
} from "@/types/calendar";

export const calendarService = {
  /** Timeline gabungan dalam satu bulan (Meeting + CalendarEvent). */
  month: async (month: number, year: number): Promise<CalendarItem[]> => {
    const { data } = await api.get<CalendarItem[]>("/calendar/month", {
      params: { month, year },
    });
    return data;
  },

  /** Event mendatang (gabungan), dibatasi limit. */
  upcoming: async (limit = 5): Promise<CalendarItem[]> => {
    const { data } = await api.get<CalendarItem[]>("/calendar/upcoming", {
      params: { limit },
    });
    return data;
  },

  /** List CalendarEvent ter-paginasi. */
  list: async (
    filters?: CalendarEventFilters,
  ): Promise<Paginated<CalendarEvent>> => {
    const { data } = await api.get<Paginated<CalendarEvent>>(
      "/calendar/events",
      { params: filters },
    );
    return data;
  },

  get: async (id: string): Promise<CalendarEvent> => {
    const { data } = await api.get<CalendarEvent>(`/calendar/events/${id}`);
    return data;
  },

  create: async (
    payload: CreateCalendarEventPayload,
  ): Promise<CalendarEvent> => {
    const { data } = await api.post<CalendarEvent>(
      "/calendar/events",
      payload,
    );
    return data;
  },

  update: async (
    id: string,
    payload: UpdateCalendarEventPayload,
  ): Promise<CalendarEvent> => {
    const { data } = await api.patch<CalendarEvent>(
      `/calendar/events/${id}`,
      payload,
    );
    return data;
  },

  remove: async (id: string): Promise<{ id: string; deleted: true }> => {
    const { data } = await api.delete<{ id: string; deleted: true }>(
      `/calendar/events/${id}`,
    );
    return data;
  },
};
