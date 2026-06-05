"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingState, ErrorState } from "@/components/shared/data-states";
import {
  DepartmentForm,
  type DepartmentFormSubmit,
} from "@/features/departments/components/department-form";
import { useDepartment } from "@/hooks/use-department";
import {
  useUpdateDepartment,
  useDeleteDepartment,
} from "@/hooks/use-department-mutations";
import { useAuthStore } from "@/stores/auth.store";
import { isAdmin } from "@/lib/roles";

export default function DepartmentDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const role = useAuthStore((s) => s.user?.role);
  const canManage = isAdmin(role);

  const { data: department, isLoading, isError, refetch } = useDepartment(id);
  const updateDepartment = useUpdateDepartment(id);
  const deleteDepartment = useDeleteDepartment();
  const [editing, setEditing] = useState(false);

  if (isLoading) return <LoadingState label="Memuat department…" />;
  if (isError || !department)
    return (
      <ErrorState
        label="Department tidak ditemukan."
        onRetry={() => refetch()}
      />
    );

  const handleUpdate = async (values: DepartmentFormSubmit) => {
    await updateDepartment.mutateAsync(values);
    setEditing(false);
  };

  const handleDelete = async () => {
    await deleteDepartment.mutateAsync(id);
    router.push("/departments");
  };

  const updateError =
    updateDepartment.error instanceof AxiosError
      ? ((updateDepartment.error.response?.data as { message?: string })
          ?.message ?? "Gagal menyimpan.")
      : null;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/departments">
          <ArrowLeftIcon className="size-4" />
          Kembali ke Departments
        </Link>
      </Button>

      <Card>
        <CardHeader className="flex-row items-start justify-between">
          <CardTitle className="text-lg">{department.name}</CardTitle>
          {canManage && !editing && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
              >
                <PencilIcon className="size-4" />
                Edit
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2Icon className="size-4" />
                    Hapus
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Hapus department?</DialogTitle>
                    <DialogDescription>
                      Department &ldquo;{department.name}&rdquo; akan dihapus.
                      Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" size="sm">
                        Batal
                      </Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      disabled={deleteDepartment.isPending}
                    >
                      {deleteDepartment.isPending ? "Menghapus…" : "Hapus"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {editing ? (
            <>
              {updateError && (
                <p className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {updateError}
                </p>
              )}
              <DepartmentForm
                defaultValues={{
                  name: department.name,
                  description: department.description ?? "",
                }}
                isSubmitting={updateDepartment.isPending}
                submitLabel="Simpan Perubahan"
                onSubmit={handleUpdate}
              />
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setEditing(false)}
              >
                Batal
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-foreground/90">
                {department.description ?? "Tidak ada deskripsi."}
              </p>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">Dibuat</span>
                <span className="text-sm">
                  {new Date(department.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
