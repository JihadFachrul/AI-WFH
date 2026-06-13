/** ISO → nilai untuk <input type="datetime-local"> (waktu lokal "YYYY-MM-DDTHH:mm"). */
export function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

/** Nilai datetime-local lokal → ISO UTC untuk dikirim ke backend. */
export function localInputToIso(value: string): string {
  return new Date(value).toISOString();
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatTimeRange(startIso: string, endIso: string): string {
  return `${formatTime(startIso)}–${formatTime(endIso)}`;
}

/** Label bulan + tahun, mis. "Juni 2026". */
export function monthLabel(month: number, year: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
}

/** True jika ISO jatuh pada tanggal lokal yang sama dengan `date`. */
export function sameLocalDay(iso: string, date: Date): boolean {
  const d = new Date(iso);
  return (
    d.getFullYear() === date.getFullYear() &&
    d.getMonth() === date.getMonth() &&
    d.getDate() === date.getDate()
  );
}

/** Nilai datetime-local untuk `date` pada jam tertentu (menit = 0). */
export function localInputAt(date: Date, hour: number): string {
  const d = new Date(date);
  d.setHours(hour, 0, 0, 0);
  return toLocalInput(d.toISOString());
}

/** Date → param route "YYYY-MM-DD" (waktu lokal). */
export function toDateParam(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Param route "YYYY-MM-DD" → Date lokal (null jika tidak valid). */
export function parseDateParam(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Tanggal lengkap dgn nama hari, mis. "Rabu, 11 Juni 2026". */
export function formatFullDate(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
