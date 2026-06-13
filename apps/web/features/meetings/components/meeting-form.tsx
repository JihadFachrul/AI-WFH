"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { localInputToIso } from "../lib/datetime";
import type { CreateMeetingPayload } from "@/types/meeting";

const schema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(255),
  description: z.string().optional(),
  startAt: z.string().min(1, "Waktu mulai wajib diisi"),
  endAt: z.string().min(1, "Waktu selesai wajib diisi"),
  meetingUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  defaultValues: FormValues;
  initialParticipantIds: string[];
  users: { id: string; name: string; email: string }[];
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (payload: CreateMeetingPayload) => void | Promise<void>;
}

export function MeetingForm({
  defaultValues,
  initialParticipantIds,
  users,
  isSubmitting,
  submitLabel,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  const [selected, setSelected] = useState<Set<string>>(
    new Set(initialParticipantIds),
  );

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const submit = (values: FormValues) =>
    onSubmit({
      title: values.title,
      description: values.description?.trim() || undefined,
      startAt: localInputToIso(values.startAt),
      endAt: localInputToIso(values.endAt),
      meetingUrl: values.meetingUrl?.trim() || undefined,
      participantIds: [...selected],
    });

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="title" className="text-sm font-medium">
          Judul
        </label>
        <Input id="title" placeholder="mis. Sprint Planning" {...register("title")} />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium">
          Deskripsi
        </label>
        <Textarea
          id="description"
          placeholder="Agenda meeting (opsional)"
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="startAt" className="text-sm font-medium">
            Mulai
          </label>
          <Input id="startAt" type="datetime-local" {...register("startAt")} />
          {errors.startAt && (
            <p className="text-xs text-destructive">{errors.startAt.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="endAt" className="text-sm font-medium">
            Selesai
          </label>
          <Input id="endAt" type="datetime-local" {...register("endAt")} />
          {errors.endAt && (
            <p className="text-xs text-destructive">{errors.endAt.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="meetingUrl" className="text-sm font-medium">
          Meeting URL
        </label>
        <Input
          id="meetingUrl"
          type="url"
          placeholder="https://meet.google.com/…"
          {...register("meetingUrl")}
        />
        <p className="text-xs text-muted-foreground">
          Tautan Zoom / Google Meet / Teams (video tetap di platform tsb).
        </p>
      </div>

      <div className="space-y-1.5">
        <span className="text-sm font-medium">
          Peserta{" "}
          <span className="text-muted-foreground">({selected.size} dipilih)</span>
        </span>
        <div className="max-h-52 overflow-y-auto rounded-lg border border-border p-1">
          {users.length === 0 ? (
            <p className="px-2 py-3 text-xs text-muted-foreground">
              Tidak ada user.
            </p>
          ) : (
            users.map((u) => (
              <label
                key={u.id}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
              >
                <input
                  type="checkbox"
                  className="size-4 rounded border-input accent-primary"
                  checked={selected.has(u.id)}
                  onChange={() => toggle(u.id)}
                />
                <span className="flex-1">{u.name}</span>
                <span className="text-xs text-muted-foreground">{u.email}</span>
              </label>
            ))
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Menyimpan…" : submitLabel}
      </Button>
    </form>
  );
}
