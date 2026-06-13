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
