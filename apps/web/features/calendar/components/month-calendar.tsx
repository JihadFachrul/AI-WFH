"use client";

import { cn } from "@/lib/utils";
import { typeStyle } from "../lib/event-type";
import { formatTime } from "../lib/datetime";
import {
  WEEKDAY_LABELS,
  buildMonthGrid,
  groupByDay,
  type DayCell,
} from "../lib/month";
import type { CalendarItem } from "@/types/calendar";

const MAX_VISIBLE = 3;

interface Props {
  month: number;
  year: number;
  today: Date;
  items: CalendarItem[];
  onSelect: (item: CalendarItem) => void;
  /** Klik pada sel tanggal / "+N lainnya" → buka Day View. */
  onSelectDay: (date: Date, dayItems: CalendarItem[]) => void;
}

export function MonthCalendar({
  month,
  year,
  today,
  items,
  onSelect,
  onSelectDay,
}: Props) {
  const cells = buildMonthGrid(month, year, today);
  const byDay = groupByDay(items);

  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      {/* Header hari */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/40">
        {WEEKDAY_LABELS.map((d) => (
          <div
            key={d}
            className="px-2 py-2 text-center font-mono text-[11px] uppercase tracking-wide text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid tanggal */}
      <div className="grid grid-cols-7">
        {cells.map((cell) => (
          <DayCellView
            key={cell.key}
            cell={cell}
            items={byDay[cell.key] ?? []}
            onSelect={onSelect}
            onSelectDay={onSelectDay}
          />
        ))}
      </div>
    </div>
  );
}

function DayCellView({
  cell,
  items,
  onSelect,
  onSelectDay,
}: {
  cell: DayCell;
  items: CalendarItem[];
  onSelect: (item: CalendarItem) => void;
  onSelectDay: (date: Date, dayItems: CalendarItem[]) => void;
}) {
  const visible = items.slice(0, MAX_VISIBLE);
  const overflow = items.length - visible.length;

  return (
    <button
      type="button"
      onClick={() => onSelectDay(cell.date, items)}
      title="Lihat hari ini"
      className={cn(
        "flex min-h-24 w-full flex-col border-b border-r border-border p-1.5 text-left transition-colors last:border-r-0 hover:bg-accent/40",
        !cell.inMonth && "bg-muted/30 text-muted-foreground",
      )}
    >
      <div className="mb-1 flex justify-end">
        <span
          className={cn(
            "inline-flex size-6 items-center justify-center rounded-full font-mono text-xs tabular-nums",
            cell.isToday
              ? "bg-primary font-semibold text-primary-foreground"
              : "text-muted-foreground",
          )}
        >
          {cell.date.getDate()}
        </span>
      </div>

      <div className="w-full space-y-1">
        {visible.map((item) => {
          const s = typeStyle(item.type);
          return (
            <span
              key={`${item.source}-${item.id}`}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  e.preventDefault();
                  onSelect(item);
                }
              }}
              title={item.title}
              className={cn(
                "flex w-full cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 text-left text-[11px] ring-1 ring-inset transition-opacity hover:opacity-80",
                s.chip,
              )}
            >
              <span className="shrink-0 font-mono">
                {formatTime(item.startAt)}
              </span>
              <span className="truncate font-medium">{item.title}</span>
            </span>
          );
        })}
        {overflow > 0 && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onSelectDay(cell.date, items);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                e.preventDefault();
                onSelectDay(cell.date, items);
              }
            }}
            className="block cursor-pointer px-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:underline"
          >
            +{overflow} lainnya
          </span>
        )}
      </div>
    </button>
  );
}
