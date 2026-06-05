"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState, ErrorState } from "@/components/shared/data-states";
import {
  UserForm,
  type UserFormSubmit,
} from "@/features/users/components/user-form";
import { useUser } from "@/hooks/use-user";
import { useUpdateUser } from "@/hooks/use-user-mutations";
import { useDepartments } from "@/hooks/use-departments";
import { useAuthStore } from "@/stores/auth.store";
import { isAdmin } from "@/lib/roles";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const role = useAuthStore((s) => s.user?.role);
  const canManage = isAdmin(role);

  const { data: user, isLoading, isError, refetch } = useUser(id);
  const updateUser = useUpdateUser(id);
  const { data: deptData } = useDepartments({ limit: 100 });
  const departments = (deptData?.data ?? []).map((d) => ({
    id: d.id,
    name: d.name,
  }));

  const handleSubmit = async (values: UserFormSubmit) => {
    await updateUser.mutateAsync({
      name: values.name,
      role: values.role,
      departmentId: values.departmentId,
      isActive: values.isActive,
    });
    router.push(`/users/${id}`);
  };

  const errorMessage =
    updateUser.error instanceof AxiosError
      ? ((updateUser.error.response?.data as { message?: string })?.message ??
        "Gagal menyimpan.")
      : null;

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-2">
        <Link href={`/users/${id}`}>
          <ArrowLeftIcon className="size-4" />
          Kembali ke Detail
        </Link>
      </Button>

      <PageHeader title="Edit User" description="Ubah role, department, status." />

      {!canManage ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Hanya admin yang dapat mengubah user.
          </CardContent>
        </Card>
      ) : isLoading ? (
        <LoadingState label="Memuat user…" />
      ) : isError || !user ? (
        <ErrorState label="User tidak ditemukan." onRetry={() => refetch()} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{user.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <p className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {errorMessage}
              </p>
            )}
            <UserForm
              mode="edit"
              departments={departments}
              isSubmitting={updateUser.isPending}
              submitLabel="Simpan Perubahan"
              defaultValues={{
                name: user.name,
                email: user.email,
                password: "",
                role: user.role,
                departmentId: user.departmentId ?? "",
                isActive: user.isActive ?? true,
              }}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
