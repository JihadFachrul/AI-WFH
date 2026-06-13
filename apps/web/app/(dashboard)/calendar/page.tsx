"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState, ErrorState } from "@/components/shared/data-states";
import { MonthCalendar } from "@/features/calendar/components/month-calendar";
import { EventDetailDialog } from "@/features/calendar/components/event-detail-dialog";
import { CreateEventDialog } from "@/features/calendar/components/create-event-dialog";
import { monthLabel, toDateParam } from "@/features/calendar/lib/datetime";
import { useCalendarMonth } from "@/hooks/use-calendar";
import { useCalendarRealtime } from "@/hooks/use-calendar-realtime";
import { useAuthStore } from "@/stores/auth.store";
import { isPrivileged } from "@/lib/roles";
import type { CalendarItem } from "@/types/calendar";

export default function CalendarPage() {
  useCalendarRealtime();
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);
  const canCreate = isPrivileged(role);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [selected, setSelected] = useState<CalendarItem | null>(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError, refetch, isPlaceholderData } =
    useCalendarMonth(month, year);
  const items = data ?? [];

  const goPrev = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };
  const goNext = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };
  const goToday = () => {
    setMonth(now.getMonth() + 1);
    setYear(now.getFullYear());
  };

  const handleSelect = (item: CalendarItem) => {
    setSelected(item);
    setOpen(true);
  };

  // Klik tanggal → buka halaman penuh Day View.
  const handleSelectDay = (date: Date) => {
    router.push(`/calendar/${toDateParam(date)}`);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Calendar"
          description="Jadwal perusahaan terpusat — meeting, event, training, dan agenda direktur."
        />
        {canCreate && <CreateEventDialog />}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold capitalize">
          {monthLabel(month, year)}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToday}>
            Hari ini
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={goPrev}
            aria-label="Bulan sebelumnya"
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={goNext}
            aria-label="Bulan berikutnya"
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <LoadingState label="Memuat kalender…" />
      ) : isError ? (
        <ErrorState label="Gagal memuat kalender." onRetry={() => refetch()} />
      ) : (
        <div className={isPlaceholderData ? "opacity-60 transition-opacity" : ""}>
          <MonthCalendar
            month={month}
            year={year}
            today={now}
            items={items}
            onSelect={handleSelect}
            onSelectDay={handleSelectDay}
          />
        </div>
      )}

      <EventDetailDialog item={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}
