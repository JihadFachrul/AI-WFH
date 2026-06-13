import { cn } from "@/lib/utils";
import { typeStyle } from "../lib/event-type";
import type { CalendarEventType } from "@/types/calendar";

/** Badge kategori event berwarna (kode tipe data). */
export function TypeBadge({
  type,
  className,
}: {
  type: CalendarEventType;
  className?: string;
}) {
  const s = typeStyle(type);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        s.chip,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}
