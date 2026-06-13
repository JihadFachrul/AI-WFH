import type { CalendarEventType } from "@/types/calendar";

/**
 * Pemetaan tipe event → label + kelas warna chip. Warna mengikuti spesifikasi
 * Modul 6.2 (blue/indigo/amber/green/red/slate) sebagai kode kategori data —
 * dipakai hanya untuk chip kecil, bukan elemen utama UI.
 */
interface TypeStyle {
  label: string;
  /** chip background + text (month grid / badge) */
  chip: string;
  /** titik penanda solid */
  dot: string;
  /** blok solid pada timeline day view (mirip Google Calendar) */
  block: string;
}

export const EVENT_TYPE_STYLE: Record<CalendarEventType, TypeStyle> = {
  MEETING: {
    label: "Meeting",
    chip: "bg-blue-100 text-blue-800 ring-blue-600/20",
    dot: "bg-blue-500",
    block: "bg-blue-500 text-white border-blue-600 hover:bg-blue-600",
  },
  COMPANY_EVENT: {
    label: "Company Event",
    chip: "bg-indigo-100 text-indigo-800 ring-indigo-600/20",
    dot: "bg-indigo-500",
    block: "bg-indigo-500 text-white border-indigo-600 hover:bg-indigo-600",
  },
  TRAINING: {
    label: "Training",
    chip: "bg-amber-100 text-amber-800 ring-amber-600/20",
    dot: "bg-amber-500",
    block: "bg-amber-500 text-white border-amber-600 hover:bg-amber-600",
  },
  HOLIDAY: {
    label: "Holiday",
    chip: "bg-green-100 text-green-800 ring-green-600/20",
    dot: "bg-green-500",
    block: "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600",
  },
  DIRECTOR_SCHEDULE: {
    label: "Director Schedule",
    chip: "bg-red-100 text-red-800 ring-red-600/20",
    dot: "bg-red-500",
    block: "bg-red-500 text-white border-red-600 hover:bg-red-600",
  },
  ANNOUNCEMENT: {
    label: "Announcement",
    chip: "bg-slate-200 text-slate-800 ring-slate-600/20",
    dot: "bg-slate-500",
    block: "bg-slate-500 text-white border-slate-600 hover:bg-slate-600",
  },
};

export const EVENT_TYPE_OPTIONS: {
  value: CalendarEventType;
  label: string;
}[] = (Object.keys(EVENT_TYPE_STYLE) as CalendarEventType[]).map((value) => ({
  value,
  label: EVENT_TYPE_STYLE[value].label,
}));

export function typeStyle(type: CalendarEventType): TypeStyle {
  return EVENT_TYPE_STYLE[type];
}
