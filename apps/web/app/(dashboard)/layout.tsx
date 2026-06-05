import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

/**
 * Layout untuk route group (dashboard). Proteksi auth + shell dipasang
 * sekali di sini (bukan di setiap page).
 */
export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
