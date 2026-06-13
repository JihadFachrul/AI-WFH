"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { connectSocket } from "@/lib/socket";

/**
 * Realtime board: pakai event existing (task:updated / task:assigned) dari
 * Realtime Foundation — TANPA event/websocket baru. Saat status task berubah
 * (oleh siapa pun), board ter-invalidate → kartu otomatis pindah kolom.
 */
export function useKanbanRealtime() {
  const qc = useQueryClient();
  const token = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);
    const onChange = () => qc.invalidateQueries({ queryKey: ["kanban"] });

    socket.on("task:updated", onChange);
    socket.on("task:assigned", onChange);
    return () => {
      socket.off("task:updated", onChange);
      socket.off("task:assigned", onChange);
    };
  }, [qc, token]);
}
