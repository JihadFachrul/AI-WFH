"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { AxiosError } from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import {
  TaskForm,
  type TaskFormSubmit,
} from "@/features/tasks/components/task-form";
import { useCreateTask } from "@/hooks/use-task-mutations";
import { useUsers } from "@/hooks/use-users";
import { useAuthStore } from "@/stores/auth.store";
import { isPrivileged } from "@/lib/roles";

export default function NewTaskPage() {
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);
  const canCreate = isPrivileged(role);

  const createTask = useCreateTask();
  const { data: usersData } = useUsers({ page: 1, limit: 100 });
  const users = (usersData?.data ?? []).map((u) => ({ id: u.id, name: u.name }));

  const handleSubmit = async (values: TaskFormSubmit) => {
    const task = await createTask.mutateAsync({
      title: values.title,
      description: values.description,
      priority: values.priority,
      assignedToId: values.assignedToId,
      dueDate: values.dueDate,
    });
    router.push(`/tasks/${task.id}`);
  };

  const errorMessage =
    createTask.error instanceof AxiosError
      ? ((createTask.error.response?.data as { message?: string })?.message ??
        "Gagal membuat task.")
      : null;

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-2">
        <Link href="/tasks">
          <ArrowLeftIcon className="size-4" />
          Kembali ke Tasks
        </Link>
      </Button>

      <PageHeader title="Task Baru" description="Buat task dan tugaskan." />

      {!canCreate ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Anda tidak memiliki izin untuk membuat task. Hubungi manager/admin.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Detail Task</CardTitle>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <p className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {errorMessage}
              </p>
            )}
            <TaskForm
              mode="create"
              canAssign
              users={users}
              isSubmitting={createTask.isPending}
              submitLabel="Buat Task"
              defaultValues={{
                title: "",
                description: "",
                priority: "MEDIUM",
                status: "TODO",
                assignedToId: "",
                dueDate: "",
              }}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
