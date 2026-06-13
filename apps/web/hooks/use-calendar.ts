"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { calendarService } from "@/services/calendar.service";
import type {
  CalendarEventFilters,
  CreateCalendarEventPayload,
  UpdateCalendarEventPayload,
} from "@/types/calendar";

export function useCalendarMonth(month: number, year: number) {
  return useQuery({
    queryKey: ["calendar", "month", year, month],
    queryFn: () => calendarService.month(month, year),
    placeholderData: keepPreviousData,
  });
}

export function useUpcomingEvents(limit = 5) {
  return useQuery({
    queryKey: ["calendar", "upcoming", limit],
    queryFn: () => calendarService.upcoming(limit),
  });
}

export function useCalendarEvents(filters: CalendarEventFilters) {
  return useQuery({
    queryKey: ["calendar", "events", filters],
    queryFn: () => calendarService.list(filters),
    placeholderData: keepPreviousData,
  });
}

export function useCalendarEvent(id: string) {
  return useQuery({
    queryKey: ["calendar", "event", id],
    queryFn: () => calendarService.get(id),
    enabled: !!id,
  });
}

export function useCreateCalendarEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCalendarEventPayload) =>
      calendarService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["calendar"] }),
  });
}

export function useUpdateCalendarEvent(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCalendarEventPayload) =>
      calendarService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["calendar"] }),
  });
}

export function useDeleteCalendarEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => calendarService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["calendar"] }),
  });
}
