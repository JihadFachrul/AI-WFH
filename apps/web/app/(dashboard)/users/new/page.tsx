"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import {
  UserForm,
  type UserFormSubmit,
} from "@/features/users/components/user-form";
import { useCreateUser } from "@/hooks/use-user-mutations";
import { useDepartments } from "@/hooks/use-departments";
import { useAuthStore } from "@/stores/auth.store";
import { isAdmin } from "@/lib/roles";

export default function NewUserPage() {
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);
  const canManage = isAdmin(role);

  const createUser = useCreateUser();
  const { data: deptData } = useDepartments({ limit: 100 });
  const departments = (deptData?.data ?? []).map((d) => ({
    id: d.id,
    name: d.name,
  }));

  const handleSubmit = async (values: UserFormSubmit) => {
    const user = await createUser.mutateAsync({
      name: values.name,
      email: values.email ?? "",
      password: values.password ?? "",
      role: values.role,
      departmentId: values.departmentId,
    });
    router.push(`/users/${user.id}`);
  };

  const errorMessage =
    createUser.error instanceof AxiosError
      ? ((createUser.error.response?.data as { message?: string })?.message ??
        "Gagal membuat user.")
      : null;

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-2">
        <Link href="/users">
          <ArrowLeftIcon className="size-4" />
          Kembali ke Users
        </Link>
      </Button>

      <PageHeader title="User Baru" description="Tambahkan anggota organisasi." />

      {!canManage ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Hanya admin yang dapat membuat user.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Detail User</CardTitle>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <p className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {errorMessage}
              </p>
            )}
            <UserForm
              mode="create"
              departments={departments}
              isSubmitting={createUser.isPending}
              submitLabel="Buat User"
              defaultValues={{
                name: "",
                email: "",
                password: "",
                role: "EMPLOYEE",
                departmentId: "",
                isActive: true,
              }}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
