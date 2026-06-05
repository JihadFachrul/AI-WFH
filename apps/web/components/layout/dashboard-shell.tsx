"use client";

import { useEffect, type ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useAuthStore } from "@/stores/auth.store";
import { connectSocket } from "@/lib/socket";

/**
 * Shell dashboard: AuthGuard + Sidebar + Header + content area.
 * Saat mount (mis. setelah refresh), socket disambungkan ulang memakai token
 * dari store agar realtime tetap siap.
 */
export function DashboardShell({ children }: { children: ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (accessToken) {
      connectSocket(accessToken);
    }
  }, [accessToken]);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
