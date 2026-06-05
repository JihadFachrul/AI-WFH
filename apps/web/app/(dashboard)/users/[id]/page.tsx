"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState, ErrorState } from "@/components/shared/data-states";
import { UserRoleBadge } from "@/features/users/components/user-role-badge";
import { UserStatusBadge } from "@/features/users/components/user-status-badge";
import { useUser } from "@/hooks/use-user";
import { useDepartment } from "@/hooks/use-department";
import { useAuthStore } from "@/stores/auth.store";
import { isAdmin } from "@/lib/roles";

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm">{children}</span>
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const role = useAuthStore((s) => s.user?.role);
  const canManage = isAdmin(role);

  const { data: user, isLoading, isError, refetch } = useUser(id);
  const { data: department } = useDepartment(user?.departmentId ?? "");

  if (isLoading) return <LoadingState label="Memuat profil…" />;
  if (isError || !user)
    return (
      <ErrorState
        label="User tidak ditemukan atau Anda tidak punya akses."
        onRetry={() => refetch()}
      />
    );

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/users">
          <ArrowLeftIcon className="size-4" />
          Kembali ke Users
        </Link>
      </Button>

      <Card>
        <CardHeader className="flex-row items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground">
              {initials(user.name)}
            </span>
            <div>
              <CardTitle className="text-lg">{user.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          {canManage && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/users/${user.id}/edit`}>
                <PencilIcon className="size-4" />
                Edit
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <InfoRow label="Role">
              <UserRoleBadge role={user.role} />
            </InfoRow>
            <InfoRow label="Department">
              {department?.name ?? "Tidak ada"}
            </InfoRow>
            <InfoRow label="Status">
              <UserStatusBadge isActive={user.isActive ?? true} />
            </InfoRow>
            <InfoRow label="Bergabung">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "—"}
            </InfoRow>
            <InfoRow label="Diperbarui">
              {user.updatedAt
                ? new Date(user.updatedAt).toLocaleDateString()
                : "—"}
            </InfoRow>
            <InfoRow label="User ID">
              <span className="font-mono text-xs">{user.id}</span>
            </InfoRow>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
