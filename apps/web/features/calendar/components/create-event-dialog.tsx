"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EventForm } from "./event-form";
import { useCreateCalendarEvent } from "@/hooks/use-calendar";
import type { CreateCalendarEventPayload } from "@/types/calendar";

/** Tombol + dialog pembuatan event (privileged: MANAGER/ADMIN/SUPER_ADMIN). */
export function CreateEventDialog() {
  const [open, setOpen] = useState(false);
  const createEvent = useCreateCalendarEvent();

  const handleSubmit = async (payload: CreateCalendarEventPayload) => {
    await createEvent.mutateAsync(payload);
    setOpen(false);
  };

  const errorMessage =
    createEvent.error instanceof AxiosError
      ? ((createEvent.error.response?.data as { message?: string })?.message ??
        "Gagal membuat event.")
      : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          Event Baru
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Event Baru</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {errorMessage}
          </p>
        )}
        <EventForm
          defaultValues={{
            title: "",
            description: "",
            type: "COMPANY_EVENT",
            startAt: "",
            endAt: "",
          }}
          isSubmitting={createEvent.isPending}
          submitLabel="Buat Event"
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
