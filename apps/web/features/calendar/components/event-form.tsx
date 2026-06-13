"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { localInputToIso } from "../lib/datetime";
import { EVENT_TYPE_OPTIONS } from "../lib/event-type";
import type {
  CalendarEventType,
  CreateCalendarEventPayload,
} from "@/types/calendar";

const TYPE_VALUES = EVENT_TYPE_OPTIONS.map((o) => o.value) as [
  CalendarEventType,
  ...CalendarEventType[],
];

const schema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(255),
  description: z.string().optional(),
  type: z.enum(TYPE_VALUES),
  startAt: z.string().min(1, "Waktu mulai wajib diisi"),
  endAt: z.string().min(1, "Waktu selesai wajib diisi"),
});

export type EventFormValues = z.infer<typeof schema>;

interface Props {
  defaultValues: EventFormValues;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (payload: CreateCalendarEventPayload) => void | Promise<void>;
}

export function EventForm({
  defaultValues,
  isSubmitting,
  submitLabel,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const submit = (values: EventFormValues) =>
    onSubmit({
      title: values.title,
      description: values.description?.trim() || undefined,
      type: values.type,
      startAt: localInputToIso(values.startAt),
      endAt: localInputToIso(values.endAt),
    });

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="title" className="text-sm font-medium">
          Judul
        </label>
        <Input
          id="title"
          placeholder="mis. Q2 Town Hall"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="type" className="text-sm font-medium">
          Tipe
        </label>
        <select
          id="type"
          className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...register("type")}
        >
          {EVENT_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="text-xs text-destructive">{errors.type.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium">
          Deskripsi
        </label>
        <Textarea
          id="description"
          placeholder="Detail event (opsional)"
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

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Menyimpan…" : submitLabel}
      </Button>
    </form>
  );
}
