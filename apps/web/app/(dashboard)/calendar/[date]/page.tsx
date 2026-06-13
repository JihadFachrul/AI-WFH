"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "lucide-react";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingState, ErrorState } from "@/components/shared/data-states";
import { DayTimeline } from "@/features/calendar/components/day-timeline";
import { EventDetailDialog } from "@/features/calendar/components/event-detail-dialog";
import { EventForm } from "@/features/calendar/components/event-form";
import {
  formatFullDate,
  localInputAt,
  parseDateParam,
  sameLocalDay,
  toDateParam,
} from "@/features/calendar/lib/datetime";
import { useCalendarMonth, useCreateCalendarEvent } from "@/hooks/use-calendar";
import { useCalendarRealtime } from "@/hooks/use-calendar-realtime";
import { useAuthStore } from "@/stores/auth.store";
import { isPrivileged } from "@/lib/roles";
import type {
  CalendarItem,
  CreateCalendarEventPayload,
} from "@/types/calendar";

export default function CalendarDayPage() {
  useCalendarRealtime();
  const router = useRouter();
  const params = useParams<{ date: string }>();
  const date = parseDateParam(params.date);

  const role = useAuthStore((s) => s.user?.role);
  const canCreate = isPrivileged(role);

  const [selected, setSelected] = useState<CalendarItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createSlot, setCreateSlot] = useState<{
    start: string;
    end: string;
  } | null>(null);

  const createEvent = useCreateCalendarEvent();

  // Query bulan yang memuat tanggal ini, lalu filter event hari tsb.
  const month = date ? date.getMonth() + 1 : 1;
  const year = date ? date.getFullYear() : 2000;
  const { data, isLoading, isError, refetch } = useCalendarMonth(month, year);

  const dayItems = useMemo(
    () =>
      date ? (data ?? []).filter((i) => sameLocalDay(i.startAt, date)) : [],
    [data, date],
  );

  if (!date) {
    return (
      <ErrorState
        label="Tanggal tidak valid."
        onRetry={() => router.push("/calendar")}
      />
    );
  }

  const goDay = (offset: number) => {
    const next = new Date(date);
    next.setDate(next.getDate() + offset);
    router.push(`/calendar/${toDateParam(next)}`);
  };
  const goToday = () => router.push(`/calendar/${toDateParam(new Date())}`);

  const handleSelectItem = (item: CalendarItem) => {
    setSelected(item);
    setDetailOpen(true);
  };

  const handleCreateAt = (hour: number) => {
    setCreateSlot({
      start: localInputAt(date, hour),
      end: localInputAt(date, Math.min(hour + 1, 24)),
    });
  };

  const handleCreate = async (payload: CreateCalendarEventPayload) => {
    await createEvent.mutateAsync(payload);
    setCreateSlot(null);
  };

  const createError =
    createEvent.error instanceof AxiosError
      ? ((createEvent.error.response?.data as { message?: string })?.message ??
        "Gagal membuat event.")
      : null;

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" className="-ml-2 mb-1" asChild>
            <Link href="/calendar">
              <ArrowLeftIcon className="size-4" />
              Kalender
            </Link>
          </Button>
          <h1 className="font-display text-2xl font-semibold capitalize leading-tight">
            {formatFullDate(date)}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {canCreate && (
            <Button size="sm" onClick={() => handleCreateAt(9)}>
              <PlusIcon className="size-4" />
              Event Baru
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={goToday}>
            Hari ini
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => goDay(-1)}
            aria-label="Hari sebelumnya"
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => goDay(1)}
            aria-label="Hari berikutnya"
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <LoadingState label="Memuat hari…" />
      ) : isError ? (
        <ErrorState label="Gagal memuat kalender." onRetry={() => refetch()} />
      ) : (
        <DayTimeline
          date={date}
          items={dayItems}
          canCreate={canCreate}
          onSelectItem={handleSelectItem}
          onCreateAt={handleCreateAt}
          className="min-h-0 flex-1"
        />
      )}

      <EventDetailDialog
        item={selected}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <Dialog
        open={!!createSlot}
        onOpenChange={(o) => !o && setCreateSlot(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event Baru</DialogTitle>
          </DialogHeader>
          {createError && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {createError}
            </p>
          )}
          {createSlot && (
            <EventForm
              defaultValues={{
                title: "",
                description: "",
                type: "COMPANY_EVENT",
                startAt: createSlot.start,
                endAt: createSlot.end,
              }}
              isSubmitting={createEvent.isPending}
              submitLabel="Buat Event"
              onSubmit={handleCreate}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
