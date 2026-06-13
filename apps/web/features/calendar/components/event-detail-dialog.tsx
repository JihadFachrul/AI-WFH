"use client";

import { useState } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  VideoIcon,
  ExternalLinkIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TypeBadge } from "./type-badge";
import { EventForm } from "./event-form";
import { formatDate, formatTimeRange, toLocalInput } from "../lib/datetime";
import {
  useUpdateCalendarEvent,
  useDeleteCalendarEvent,
} from "@/hooks/use-calendar";
import { useAuthStore } from "@/stores/auth.store";
import { isAdmin } from "@/lib/roles";
import type {
  CalendarItem,
  CreateCalendarEventPayload,
} from "@/types/calendar";

interface Props {
  item: CalendarItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventDetailDialog({ item, open, onOpenChange }: Props) {
  const role = useAuthStore((s) => s.user?.role);
  const currentUserId = useAuthStore((s) => s.user?.id);
  const [editing, setEditing] = useState(false);

  // hooks dipanggil unconditionally (id kosong saat item null — mutation tidak dipicu)
  const updateEvent = useUpdateCalendarEvent(item?.id ?? "");
  const deleteEvent = useDeleteCalendarEvent();

  if (!item) return null;

  const isMeeting = item.source === "MEETING";
  const canEdit =
    !isMeeting &&
    (isAdmin(role) ||
      (role === "MANAGER" && item.organizer.id === currentUserId));
  const canDelete = !isMeeting && isAdmin(role);

  const close = () => {
    setEditing(false);
    onOpenChange(false);
  };

  const handleUpdate = async (payload: CreateCalendarEventPayload) => {
    await updateEvent.mutateAsync(payload);
    setEditing(false);
    onOpenChange(false);
  };

  const handleDelete = async () => {
    await deleteEvent.mutateAsync(item.id);
    close();
  };

  const updateError =
    updateEvent.error instanceof AxiosError
      ? ((updateEvent.error.response?.data as { message?: string })?.message ??
        "Gagal menyimpan.")
      : null;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setEditing(false);
        onOpenChange(o);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <TypeBadge type={item.type} />
          </div>
          <DialogTitle className="text-lg">{item.title}</DialogTitle>
          {item.description ? (
            <DialogDescription>{item.description}</DialogDescription>
          ) : null}
        </DialogHeader>

        {editing ? (
          <div className="space-y-2">
            {updateError && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {updateError}
              </p>
            )}
            <EventForm
              defaultValues={{
                title: item.title,
                description: item.description ?? "",
                type: item.type,
                startAt: toLocalInput(item.startAt),
                endAt: toLocalInput(item.endAt),
              }}
              isSubmitting={updateEvent.isPending}
              submitLabel="Simpan Perubahan"
              onSubmit={handleUpdate}
            />
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Batal
            </Button>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-4 text-muted-foreground" />
              {formatDate(item.startAt)}
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <ClockIcon className="size-4 text-muted-foreground" />
              {formatTimeRange(item.startAt, item.endAt)}
            </div>
            <div className="flex items-center gap-2">
              <UserIcon className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Organizer:</span>{" "}
              {item.organizer.name}
            </div>

            {isMeeting && item.meetingUrl && (
              <Button asChild size="sm">
                <a
                  href={item.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <VideoIcon className="size-4" />
                  Join Meeting
                </a>
              </Button>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-2">
              {isMeeting && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/meetings/${item.id}`}>
                    <ExternalLinkIcon className="size-4" />
                    Buka detail meeting
                  </Link>
                </Button>
              )}
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(true)}
                >
                  <PencilIcon className="size-4" />
                  Edit
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteEvent.isPending}
                >
                  <Trash2Icon className="size-4" />
                  {deleteEvent.isPending ? "Menghapus…" : "Hapus"}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
