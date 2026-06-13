"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { meetingsService } from "@/services/meetings.service";
import type {
  MeetingFilters,
  CreateMeetingPayload,
  UpdateMeetingPayload,
} from "@/types/meeting";

export function useMeetings(filters: MeetingFilters) {
  return useQuery({
    queryKey: ["meetings", filters],
    queryFn: () => meetingsService.list(filters),
    placeholderData: keepPreviousData,
  });
}

export function useMeeting(id: string) {
  return useQuery({
    queryKey: ["meeting", id],
    queryFn: () => meetingsService.get(id),
    enabled: !!id,
  });
}

export function useTodayMeetings() {
  return useQuery({
    queryKey: ["meetings", "today"],
    queryFn: () => meetingsService.today(),
  });
}

export function useCreateMeeting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMeetingPayload) =>
      meetingsService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["meetings"] }),
  });
}

export function useUpdateMeeting(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateMeetingPayload) =>
      meetingsService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meetings"] });
      qc.invalidateQueries({ queryKey: ["meeting", id] });
    },
  });
}

export function useDeleteMeeting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => meetingsService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["meetings"] }),
  });
}
