"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { connectSocket } from "@/lib/socket";

/**
 * Realtime calendar: event existing (calendar:event-created/updated/deleted)
 * di-broadcast dari Realtime Foundation (perusahaan-wide). Saat ada perubahan,
 * invalidate seluruh query kalender.
 */
export function useCalendarRealtime() {
  const qc = useQueryClient();
  const token = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);
    const onChange = () => {
      qc.invalidateQueries({ queryKey: ["calendar"] });
    };

    socket.on("calendar:event-created", onChange);
    socket.on("calendar:event-updated", onChange);
    socket.on("calendar:event-deleted", onChange);
    return () => {
      socket.off("calendar:event-created", onChange);
      socket.off("calendar:event-updated", onChange);
      socket.off("calendar:event-deleted", onChange);
    };
  }, [qc, token]);
}
