import type { CalendarItem } from "@/types/calendar";

export interface PositionedItem {
  item: CalendarItem;
  /** menit dari 00:00 (di-clamp ke rentang hari). */
  startMin: number;
  endMin: number;
  /** kolom (untuk event yang tumpang tindih) & jumlah kolom dalam klaster. */
  col: number;
  cols: number;
}

const DAY_MIN = 24 * 60;
const MIN_DURATION = 30; // tinggi minimum blok agar tetap terbaca

/**
 * Hitung posisi vertikal + penempatan kolom untuk event satu hari ala
 * Google Calendar. Event yang tumpang tindih dibagi ke kolom berdampingan.
 */
export function layoutDay(items: CalendarItem[], date: Date): PositionedItem[] {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const base = dayStart.getTime();

  const events = items
    .map((item) => {
      const s = (new Date(item.startAt).getTime() - base) / 60000;
      const e = (new Date(item.endAt).getTime() - base) / 60000;
      const startMin = Math.min(Math.max(s, 0), DAY_MIN);
      const endMin = Math.min(Math.max(e, startMin + MIN_DURATION), DAY_MIN);
      return { item, startMin, endMin, col: 0, cols: 1 };
    })
    .sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);

  // Bagi menjadi klaster yang saling tumpang tindih, lalu warnai kolom.
  let cluster: PositionedItem[] = [];
  let clusterEnd = -1;

  const flush = () => {
    if (cluster.length === 0) return;
    const colEnds: number[] = []; // waktu selesai terakhir per kolom
    for (const ev of cluster) {
      let placed = false;
      for (let c = 0; c < colEnds.length; c++) {
        if (ev.startMin >= colEnds[c]) {
          ev.col = c;
          colEnds[c] = ev.endMin;
          placed = true;
          break;
        }
      }
      if (!placed) {
        ev.col = colEnds.length;
        colEnds.push(ev.endMin);
      }
    }
    const cols = colEnds.length;
    for (const ev of cluster) ev.cols = cols;
    cluster = [];
    clusterEnd = -1;
  };

  for (const ev of events) {
    if (cluster.length > 0 && ev.startMin >= clusterEnd) flush();
    cluster.push(ev);
    clusterEnd = Math.max(clusterEnd, ev.endMin);
  }
  flush();

  return events;
}
