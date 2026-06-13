"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { connectSocket } from "@/lib/socket";

/**
 * Realtime meeting: pakai event existing (meeting:created/updated/deleted) dari
 * Realtime Foundation. Saat ada perubahan, invalidate query meeting.
 */
export function useMeetingRealtime() {
  const qc = useQueryClient();
  const token = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);
    const onChange = () => {
      qc.invalidateQueries({ queryKey: ["meetings"] });
      qc.invalidateQueries({ queryKey: ["meeting"] });
    };

    socket.on("meeting:created", onChange);
    socket.on("meeting:updated", onChange);
    socket.on("meeting:deleted", onChange);
    return () => {
      socket.off("meeting:created", onChange);
      socket.off("meeting:updated", onChange);
      socket.off("meeting:deleted", onChange);
    };
  }, [qc, token]);
}
