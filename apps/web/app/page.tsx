"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

/**
 * Entry point: arahkan ke /dashboard jika sudah login, selain itu /login.
 * Keputusan dibuat setelah store rehydrate.
 */
export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;
    router.replace(isAuthenticated ? "/dashboard" : "/login");
  }, [hasHydrated, isAuthenticated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      Memuat…
    </div>
  );
}
