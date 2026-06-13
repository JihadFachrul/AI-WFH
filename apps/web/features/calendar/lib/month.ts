import type { CalendarItem } from "@/types/calendar";

export interface DayCell {
  date: Date;
  /** kunci lokal YYYY-MM-DD */
  key: string;
  inMonth: boolean;
  isToday: boolean;
}

export const WEEKDAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

/** Kunci tanggal lokal (YYYY-MM-DD) dari Date. */
export function dateKey(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Bangun grid 6×7 (42 sel) untuk satu bulan, dimulai dari Minggu sebelum
 * tanggal 1. Sel di luar bulan ditandai inMonth=false.
 */
export function buildMonthGrid(
  month: number,
  year: number,
  today: Date,
): DayCell[] {
  const firstOfMonth = new Date(year, month - 1, 1);
  const startWeekday = firstOfMonth.getDay(); // 0=Minggu
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - startWeekday);

  const todayKey = dateKey(today);
  const cells: DayCell[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    cells.push({
      date,
      key: dateKey(date),
      inMonth: date.getMonth() === month - 1,
      isToday: dateKey(date) === todayKey,
    });
  }
  return cells;
}

/** Kelompokkan item ke kunci tanggal lokal berdasarkan startAt. */
export function groupByDay(
  items: CalendarItem[],
): Record<string, CalendarItem[]> {
  const map: Record<string, CalendarItem[]> = {};
  for (const item of items) {
    const key = dateKey(new Date(item.startAt));
    (map[key] ??= []).push(item);
  }
  return map;
}
