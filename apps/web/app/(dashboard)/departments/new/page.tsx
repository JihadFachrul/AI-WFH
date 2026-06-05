"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import {
  DepartmentForm,
  type DepartmentFormSubmit,
} from "@/features/departments/components/department-form";
import { useCreateDepartment } from "@/hooks/use-department-mutations";
import { useAuthStore } from "@/stores/auth.store";
import { isAdmin } from "@/lib/roles";

export default function NewDepartmentPage() {
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);
  const canManage = isAdmin(role);
  const createDepartment = useCreateDepartment();

  const handleSubmit = async (values: DepartmentFormSubmit) => {
    const dept = await createDepartment.mutateAsync(values);
    router.push(`/departments/${dept.id}`);
  };

  const errorMessage =
    createDepartment.error instanceof AxiosError
      ? ((createDepartment.error.response?.data as { message?: string })
          ?.message ?? "Gagal membuat department.")
      : null;

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-2">
        <Link href="/departments">
          <ArrowLeftIcon className="size-4" />
          Kembali ke Departments
        </Link>
      </Button>

      <PageHeader title="Department Baru" description="Buat departemen baru." />

      {!canManage ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Anda tidak memiliki izin untuk membuat department.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Detail Department</CardTitle>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <p className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {errorMessage}
              </p>
            )}
            <DepartmentForm
              defaultValues={{ name: "", description: "" }}
              isSubmitting={createDepartment.isPending}
              submitLabel="Buat Department"
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
