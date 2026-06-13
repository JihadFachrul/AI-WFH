"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  PencilIcon,
  Trash2Icon,
  VideoIcon,
  CalendarIcon,
  ClockIcon,
} from "lucide-react";
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
import { MeetingForm } from "@/features/meetings/components/meeting-form";
import {
  formatDate,
  formatTimeRange,
  toLocalInput,
} from "@/features/meetings/lib/datetime";
import {
  useMeeting,
  useUpdateMeeting,
  useDeleteMeeting,
} from "@/hooks/use-meetings";
import { useMeetingRealtime } from "@/hooks/use-meeting-realtime";
import { useUsers } from "@/hooks/use-users";
import { useAuthStore } from "@/stores/auth.store";
import { isAdmin } from "@/lib/roles";
import type { CreateMeetingPayload } from "@/types/meeting";

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function MeetingDetailPage() {
  useMeetingRealtime();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const role = useAuthStore((s) => s.user?.role);
  const currentUserId = useAuthStore((s) => s.user?.id);

  const { data: meeting, isLoading, isError, refetch } = useMeeting(id);
  const updateMeeting = useUpdateMeeting(id);
  const deleteMeeting = useDeleteMeeting();
  const { data: usersData } = useUsers({ page: 1, limit: 100 });
  const [editing, setEditing] = useState(false);

  if (isLoading) return <LoadingState label="Memuat meeting…" />;
  if (isError || !meeting)
    return (
      <ErrorState
        label="Meeting tidak ditemukan atau Anda tidak punya akses."
        onRetry={() => refetch()}
      />
    );

  const canEdit =
    isAdmin(role) ||
    (role === "MANAGER" && meeting.createdById === currentUserId);
  const canDelete = isAdmin(role);

  const handleUpdate = async (payload: CreateMeetingPayload) => {
    await updateMeeting.mutateAsync(payload);
    setEditing(false);
  };

  const handleDelete = async () => {
    await deleteMeeting.mutateAsync(id);
    router.push("/meetings");
  };

  const updateError =
    updateMeeting.error instanceof AxiosError
      ? ((updateMeeting.error.response?.data as { message?: string })?.message ??
        "Gagal menyimpan.")
      : null;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/meetings">
          <ArrowLeftIcon className="size-4" />
          Kembali ke Meetings
        </Link>
      </Button>

      <Card>
        <CardHeader className="flex-row items-start justify-between">
          <CardTitle className="text-xl">{meeting.title}</CardTitle>
          {canEdit && !editing && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
              >
                <PencilIcon className="size-4" />
                Edit
              </Button>
              {canDelete && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2Icon className="size-4" />
                      Hapus
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Hapus meeting?</DialogTitle>
                      <DialogDescription>
                        &ldquo;{meeting.title}&rdquo; akan dihapus. Peserta tidak
                        lagi melihat meeting ini.
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
                        disabled={deleteMeeting.isPending}
                      >
                        {deleteMeeting.isPending ? "Menghapus…" : "Hapus"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
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
              <MeetingForm
                defaultValues={{
                  title: meeting.title,
                  description: meeting.description ?? "",
                  startAt: toLocalInput(meeting.startAt),
                  endAt: toLocalInput(meeting.endAt),
                  meetingUrl: meeting.meetingUrl ?? "",
                }}
                initialParticipantIds={meeting.participants.map((p) => p.user.id)}
                users={usersData?.data ?? []}
                isSubmitting={updateMeeting.isPending}
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
            <div className="space-y-5">
              {meeting.description && (
                <p className="text-sm text-foreground/90">
                  {meeting.description}
                </p>
              )}

              <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
                <span className="inline-flex items-center gap-2">
                  <CalendarIcon className="size-4 text-muted-foreground" />
                  {formatDate(meeting.startAt)}
                </span>
                <span className="inline-flex items-center gap-2 font-mono text-xs">
                  <ClockIcon className="size-4 text-muted-foreground" />
                  {formatTimeRange(meeting.startAt, meeting.endAt)}
                </span>
              </div>

              {meeting.meetingUrl && (
                <Button asChild>
                  <a
                    href={meeting.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <VideoIcon className="size-4" />
                    Join Meeting
                  </a>
                </Button>
              )}

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Organizer
                </p>
                <p className="text-sm">{meeting.createdBy.name}</p>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Peserta ({meeting.participants.length})
                </p>
                {meeting.participants.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Belum ada peserta.
                  </p>
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {meeting.participants.map((p) => (
                      <li
                        key={p.id}
                        className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
                      >
                        <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
                          {initials(p.user.name)}
                        </span>
                        {p.user.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
