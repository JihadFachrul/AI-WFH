"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { connectSocket } from "@/lib/socket";

/**
 * Berlangganan event realtime task lalu invalidate query terkait
 * (tanpa manual refresh, tanpa koneksi socket ganda — connectSocket idempotent).
 * Dipanggil sekali di halaman task; cleanup melepas listener saat unmount.
 */
export function useTaskRealtime() {
  const qc = useQueryClient();
  const token = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);

    const onTaskUpdated = () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["task"] });
    };
    const onTaskComment = () => {
      qc.invalidateQueries({ queryKey: ["task-comments"] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    };
    const onTaskAssigned = () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    };

    socket.on("task:updated", onTaskUpdated);
    socket.on("task:comment", onTaskComment);
    socket.on("task:assigned", onTaskAssigned);

    return () => {
      socket.off("task:updated", onTaskUpdated);
      socket.off("task:comment", onTaskComment);
      socket.off("task:assigned", onTaskAssigned);
    };
  }, [qc, token]);
}
