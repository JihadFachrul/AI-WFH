"use client";

import { PageHeader } from "@/components/shared/page-header";
import { EmployeeDashboard } from "@/features/dashboard/components/employee-dashboard";
import { ManagerDashboard } from "@/features/dashboard/components/manager-dashboard";
import { AdminDashboard } from "@/features/dashboard/components/admin-dashboard";
import { useAuthStore } from "@/stores/auth.store";
import { isAdmin } from "@/lib/roles";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  // Dashboard operasional sesuai peran. Admin & Super Admin berbagi view admin.
  const renderDashboard = () => {
    if (isAdmin(role)) return <AdminDashboard />;
    if (role === "MANAGER") return <ManagerDashboard />;
    return <EmployeeDashboard />;
  };

  return (
    <div>
      <PageHeader
        title={`Selamat datang, ${user?.name ?? "User"}`}
        description="Ringkasan operasional workspace Anda."
      />
      {renderDashboard()}
    </div>
  );
}
