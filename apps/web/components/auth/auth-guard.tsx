"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

/**
 * Gerbang proteksi terpusat (bukan per-page). Dipasang sekali di layout
 * dashboard. Menunggu rehydrate store sebelum memutuskan, lalu redirect ke
 * /login jika belum terautentikasi.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Memuat sesi…
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // sedang diarahkan ke /login
  }

  return <>{children}</>;
}
