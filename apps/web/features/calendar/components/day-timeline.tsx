"use client";

import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { typeStyle } from "../lib/event-type";
import { layoutDay } from "../lib/day-layout";
import { formatTimeRange } from "../lib/datetime";
import type { CalendarItem } from "@/types/calendar";

const HOUR_PX = 56;
const HOURS = Array.from({ length: 24 }, (_, h) => h);

interface Props {
  date: Date;
  items: CalendarItem[];
  canCreate: boolean;
  onSelectItem: (item: CalendarItem) => void;
  /** klik slot jam kosong → buat event pada jam tsb. */
  onCreateAt: (hour: number) => void;
  /** kelas tinggi area scroll (parent yang menentukan). */
  className?: string;
}

/**
 * Grid jam 00:00–23:00 ala Google Calendar. Event jadi blok berwarna sesuai
 * durasi; yang tumpang tindih dibagi ke kolom berdampingan. Presentational —
 * tidak tahu soal dialog/route; semua aksi lewat callback.
 */
export function DayTimeline({
  date,
  items,
  canCreate,
  onSelectItem,
  onCreateAt,
  className,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const positioned = useMemo(() => layoutDay(items, date), [items, date]);
  const dayKey = date.toDateString();

  // Gulir ke ~07:00 saat tanggal berubah.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = 7 * HOUR_PX;
  }, [dayKey]);

  const nowLine = (() => {
    const now = new Date();
    const sameDay =
      now.getFullYear() === date.getFullYear() &&
      now.getMonth() === date.getMonth() &&
      now.getDate() === date.getDate();
    if (!sameDay) return null;
    return (now.getHours() * 60 + now.getMinutes()) * (HOUR_PX / 60);
  })();

  return (
    <div
      ref={scrollRef}
      className={cn(
        "overflow-y-auto rounded-xl border border-border bg-card",
        className,
      )}
    >
      <div className="relative" style={{ height: HOURS.length * HOUR_PX }}>
        {/* baris jam + area klik untuk membuat event */}
        {HOURS.map((h) => (
          <div
            key={h}
            className="absolute inset-x-0 border-t border-border"
            style={{ top: h * HOUR_PX, height: HOUR_PX }}
          >
            <span className="absolute -top-2.5 left-0 w-14 pr-2 text-right font-mono text-[11px] text-muted-foreground">
              {String(h).padStart(2, "0")}:00
            </span>
            {canCreate ? (
              <button
                type="button"
                onClick={() => onCreateAt(h)}
                title={`Buat event ${String(h).padStart(2, "0")}:00`}
                className="absolute inset-y-0 left-16 right-3 cursor-pointer rounded-sm transition-colors hover:bg-accent/50"
              />
            ) : null}
          </div>
        ))}

        {/* garis waktu sekarang */}
        {nowLine !== null && (
          <div
            className="pointer-events-none absolute left-16 right-3 z-20 flex items-center"
            style={{ top: nowLine }}
          >
            <span className="size-2.5 rounded-full bg-primary" />
            <span className="h-px flex-1 bg-primary" />
          </div>
        )}

        {/* blok event */}
        <div className="absolute inset-y-0 left-16 right-3">
          {positioned.map((p) => {
            const s = typeStyle(p.item.type);
            const widthPct = 100 / p.cols;
            return (
              <button
                key={`${p.item.source}-${p.item.id}`}
                type="button"
                onClick={() => onSelectItem(p.item)}
                title={p.item.title}
                className={cn(
                  "absolute z-10 overflow-hidden rounded-md border px-2 py-1 text-left text-xs shadow-sm transition-colors",
                  s.block,
                )}
                style={{
                  top: (p.startMin / 60) * HOUR_PX,
                  height: ((p.endMin - p.startMin) / 60) * HOUR_PX - 2,
                  left: `calc(${p.col * widthPct}% + 1px)`,
                  width: `calc(${widthPct}% - 3px)`,
                }}
              >
                <span className="block truncate font-semibold">
                  {p.item.title}
                </span>
                <span className="block truncate font-mono opacity-90">
                  {formatTimeRange(p.item.startAt, p.item.endAt)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
