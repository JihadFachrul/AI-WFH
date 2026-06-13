"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { workSessionsService } from "@/services/work-sessions.service";
import { useAuthStore } from "@/stores/auth.store";
import { connectSocket } from "@/lib/socket";

export function useCurrentSession() {
  return useQuery({
    queryKey: ["work-sessions", "me"],
    queryFn: () => workSessionsService.getMySession(),
  });
}

export function useTeamSessions() {
  return useQuery({
    queryKey: ["work-sessions", "team"],
    queryFn: () => workSessionsService.getTeamSessions(),
  });
}

export function useStartSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => workSessionsService.startSession(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["work-sessions"] }),
  });
}

export function useEndSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => workSessionsService.endSession(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["work-sessions"] }),
  });
}

/**
 * Berlangganan event presence (session:started/ended) → invalidate query
 * sesi (me + team) sehingga manager melihat perubahan realtime.
 */
export function useSessionRealtime() {
  const qc = useQueryClient();
  const token = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);
    const onChange = () =>
      qc.invalidateQueries({ queryKey: ["work-sessions"] });

    socket.on("session:started", onChange);
    socket.on("session:ended", onChange);
    return () => {
      socket.off("session:started", onChange);
      socket.off("session:ended", onChange);
    };
  }, [qc, token]);
}
