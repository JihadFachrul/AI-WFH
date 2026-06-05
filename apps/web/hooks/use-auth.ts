"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { connectSocket, disconnectSocket } from "@/lib/socket";

/**
 * useLogin: mutation login → simpan token+user ke store → connect socket.
 * Komponen pemanggil yang menangani redirect (punya akses router).
 */
export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data.accessToken, data.user);
      connectSocket(data.accessToken);
    },
  });
}

/** Logout terpusat: putuskan socket + bersihkan store. */
export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  return () => {
    disconnectSocket();
    logout();
  };
}
