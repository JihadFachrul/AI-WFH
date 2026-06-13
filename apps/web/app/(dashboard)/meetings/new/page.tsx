"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { MeetingForm } from "@/features/meetings/components/meeting-form";
import { useCreateMeeting } from "@/hooks/use-meetings";
import { useUsers } from "@/hooks/use-users";
import { useAuthStore } from "@/stores/auth.store";
import { isPrivileged } from "@/lib/roles";
import type { CreateMeetingPayload } from "@/types/meeting";

export default function NewMeetingPage() {
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);
  const canCreate = isPrivileged(role);

  const createMeeting = useCreateMeeting();
  const { data: usersData } = useUsers({ page: 1, limit: 100 });
  const users = usersData?.data ?? [];

  const handleSubmit = async (payload: CreateMeetingPayload) => {
    const meeting = await createMeeting.mutateAsync(payload);
    router.push(`/meetings/${meeting.id}`);
  };

  const errorMessage =
    createMeeting.error instanceof AxiosError
      ? ((createMeeting.error.response?.data as { message?: string })?.message ??
        "Gagal membuat meeting.")
      : null;

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-2">
        <Link href="/meetings">
          <ArrowLeftIcon className="size-4" />
          Kembali ke Meetings
        </Link>
      </Button>

      <PageHeader title="Meeting Baru" description="Jadwalkan meeting tim." />

      {!canCreate ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Hanya manager/admin yang dapat membuat meeting.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Detail Meeting</CardTitle>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <p className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {errorMessage}
              </p>
            )}
            <MeetingForm
              defaultValues={{
                title: "",
                description: "",
                startAt: "",
                endAt: "",
                meetingUrl: "",
              }}
              initialParticipantIds={[]}
              users={users}
              isSubmitting={createMeeting.isPending}
              submitLabel="Buat Meeting"
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
