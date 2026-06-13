"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState, ErrorState } from "@/components/shared/data-states";
import {
  TaskStatusBadge,
  TaskPriorityBadge,
} from "@/features/tasks/components/task-badges";
import {
  TaskForm,
  type TaskFormSubmit,
} from "@/features/tasks/components/task-form";
import { CommentSection } from "@/features/tasks/components/comment-section";
import { WorkLogTimeline } from "@/features/tasks/components/work-log-timeline";
import { ReviewForm } from "@/features/tasks/components/review-form";
import { ReviewHistory } from "@/features/tasks/components/review-history";
import { EvidenceUpload } from "@/features/tasks/components/evidence-upload";
import { EvidenceList } from "@/features/tasks/components/evidence-list";
import { CompletionNote } from "@/features/tasks/components/completion-note";
import { useTask } from "@/hooks/use-task";
import { useUpdateTask } from "@/hooks/use-task-mutations";
import { useTaskReviews, useSubmitReview } from "@/hooks/use-task-reviews";
import { useUsers } from "@/hooks/use-users";
import { useTaskRealtime } from "@/hooks/use-task-realtime";
import { useAuthStore } from "@/stores/auth.store";
import { isPrivileged, isAdmin } from "@/lib/roles";

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm">{children}</span>
    </div>
  );
}

export default function TaskDetailPage() {
  useTaskRealtime();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const role = useAuthStore((s) => s.user?.role);
  const currentUserId = useAuthStore((s) => s.user?.id);
  const canAssign = isPrivileged(role);

  const { data: task, isLoading, isError, refetch } = useTask(id);
  const { data: usersData } = useUsers({ page: 1, limit: 100 });
  const { data: reviews } = useTaskReviews(id);
  const updateTask = useUpdateTask(id);
  const submitReview = useSubmitReview(id);
  const [editing, setEditing] = useState(false);

  if (isLoading) return <LoadingState label="Memuat task…" />;
  if (isError || !task)
    return (
      <ErrorState
        label="Task tidak ditemukan atau Anda tidak punya akses."
        onRetry={() => refetch()}
      />
    );

  const canEdit = canAssign || task.assignedToId === currentUserId;
  // Evidence & completion note: pemilik task (assignee) atau admin (spec).
  const canContribute = isAdmin(role) || task.assignedToId === currentUserId;

  // Manager Review: hanya MANAGER/ADMIN/SUPER_ADMIN yang boleh mereview.
  const canReview = canAssign;
  // Submit untuk review: assignee/admin, saat task belum REVIEW/DONE.
  const canSubmitForReview =
    canContribute && (task.status === "TODO" || task.status === "IN_PROGRESS");
  const latestReview = reviews?.[0];
  const reviewBadge =
    task.status === "REVIEW"
      ? { label: "Menunggu Review", cls: "bg-amber-100 text-amber-700" }
      : latestReview?.decision === "APPROVED"
        ? { label: "Disetujui", cls: "bg-emerald-100 text-emerald-700" }
        : latestReview?.decision === "REVISION"
          ? { label: "Perlu Revisi", cls: "bg-amber-100 text-amber-700" }
          : { label: "Belum disubmit", cls: "bg-slate-100 text-slate-600" };

  const formUsers = canAssign
    ? (usersData?.data ?? []).map((u) => ({ id: u.id, name: u.name }))
    : task.assignedTo
      ? [{ id: task.assignedTo.id, name: task.assignedTo.name }]
      : [];

  const handleUpdate = async (values: TaskFormSubmit) => {
    await updateTask.mutateAsync({
      title: values.title,
      description: values.description,
      priority: values.priority,
      status: values.status,
      // assignedToId hanya dikirim bila boleh assign (backend menolak selain itu).
      ...(canAssign ? { assignedToId: values.assignedToId } : {}),
      dueDate: values.dueDate,
    });
    setEditing(false);
  };

  const updateError =
    updateTask.error instanceof AxiosError
      ? ((updateTask.error.response?.data as { message?: string })?.message ??
        "Gagal menyimpan perubahan.")
      : null;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/tasks">
          <ArrowLeftIcon className="size-4" />
          Kembali ke Tasks
        </Link>
      </Button>

      <Card>
        <CardHeader className="flex-row items-start justify-between">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          {canEdit && !editing && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <PencilIcon className="size-4" />
              Edit
            </Button>
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
              <TaskForm
                mode="edit"
                canAssign={canAssign}
                users={formUsers}
                isSubmitting={updateTask.isPending}
                submitLabel="Simpan Perubahan"
                defaultValues={{
                  title: task.title,
                  description: task.description ?? "",
                  priority: task.priority,
                  status: task.status,
                  assignedToId: task.assignedToId ?? "",
                  dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
                }}
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
              {task.description && (
                <p className="text-sm text-foreground/90">{task.description}</p>
              )}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <InfoRow label="Status">
                  <TaskStatusBadge status={task.status} />
                </InfoRow>
                <InfoRow label="Priority">
                  <TaskPriorityBadge priority={task.priority} />
                </InfoRow>
                <InfoRow label="Due Date">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "—"}
                </InfoRow>
                <InfoRow label="Assignee">
                  {task.assignedTo?.name ?? "Tidak ditugaskan"}
                </InfoRow>
                <InfoRow label="Creator">{task.createdBy.name}</InfoRow>
                <InfoRow label="Dibuat">
                  {new Date(task.createdAt).toLocaleDateString()}
                </InfoRow>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Work Progress Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <WorkLogTimeline
            taskId={id}
            currentUserId={currentUserId}
            isAdmin={isAdmin(role)}
            canContribute={canContribute}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Work Evidence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <CompletionNote
            taskId={id}
            initialNote={task.completionNote}
            completedAt={task.completedAt}
            canEdit={canContribute}
          />

          {canContribute && (
            <div>
              <h3 className="mb-2 text-sm font-semibold">Upload Evidence</h3>
              <EvidenceUpload taskId={id} />
            </div>
          )}

          <div>
            <h3 className="mb-2 text-sm font-semibold">Evidence</h3>
            <EvidenceList
              taskId={id}
              currentUserId={currentUserId}
              isAdmin={isAdmin(role)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between border-b">
          <CardTitle>Manager Review</CardTitle>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${reviewBadge.cls}`}
          >
            {reviewBadge.label}
          </span>
        </CardHeader>
        <CardContent className="space-y-5">
          {canSubmitForReview && (
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={() => submitReview.mutate()}
                disabled={submitReview.isPending}
              >
                {submitReview.isPending ? "Mengirim…" : "Submit for Review"}
              </Button>
              <span className="text-xs text-muted-foreground">
                Kirim task ini ke manager untuk direview.
              </span>
            </div>
          )}

          {canReview && <ReviewForm taskId={id} />}

          <ReviewHistory
            taskId={id}
            audience={canReview ? "reviewer" : "employee"}
          />
        </CardContent>
      </Card>

      <CommentSection taskId={id} />
    </div>
  );
}
