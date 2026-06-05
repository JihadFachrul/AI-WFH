import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types/auth";

/**
 * Auth store global (Zustand) — satu-satunya sumber kebenaran sesi.
 * Token & user dipersist ke localStorage agar sesi bertahan saat refresh.
 * `hasHydrated` dipakai guard untuk menunggu rehydrate sebelum cek auth
 * (hindari flicker / redirect prematur).
 */
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;

  login: (accessToken: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (accessToken: string | null) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      hasHydrated: false,

      login: (accessToken, user) =>
        set({ accessToken, user, isAuthenticated: true }),
      logout: () =>
        set({ accessToken: null, user: null, isAuthenticated: false }),
      setUser: (user) => set({ user }),
      setToken: (accessToken) =>
        set({ accessToken, isAuthenticated: !!accessToken }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "awos-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
