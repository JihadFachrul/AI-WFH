"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { connectSocket } from "@/lib/socket";

/**
 * Berlangganan event `notification:new` lalu invalidate query notifikasi
 * (list + unread) → badge & list refresh otomatis. Tanpa polling, tanpa
 * koneksi socket ganda (connectSocket idempotent). Dipasang sekali di header.
 */
export function useNotificationRealtime() {
  const qc = useQueryClient();
  const token = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);

    const onNew = () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    };
    socket.on("notification:new", onNew);

    return () => {
      socket.off("notification:new", onNew);
    };
  }, [qc, token]);
}
