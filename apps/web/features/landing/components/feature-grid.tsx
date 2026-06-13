import {
  ListChecksIcon,
  KanbanSquareIcon,
  CalendarClockIcon,
  CalendarRangeIcon,
  GaugeIcon,
  RadioIcon,
} from "lucide-react";

const FEATURES = [
  {
    icon: ListChecksIcon,
    title: "Task Management",
    desc: "Buat, assign, lacak status & prioritas tugas tim dengan komentar dan riwayat.",
  },
  {
    icon: KanbanSquareIcon,
    title: "Kanban Workspace",
    desc: "Pindahkan tugas antar kolom secara drag-and-drop — status update real-time.",
  },
  {
    icon: CalendarClockIcon,
    title: "Meeting Scheduler",
    desc: "Jadwalkan meeting tim, undang peserta, dan join via tautan eksternal.",
  },
  {
    icon: CalendarRangeIcon,
    title: "Corporate Calendar",
    desc: "Timeline gabungan meeting + event perusahaan dalam satu kalender bulan & hari.",
  },
  {
    icon: GaugeIcon,
    title: "KPI Otomatis",
    desc: "Skor performa dihitung dinamis dari task, evidence, review, dan sesi kerja.",
  },
  {
    icon: RadioIcon,
    title: "Realtime",
    desc: "Notifikasi, presence tim, dan perubahan tugas tersinkron langsung via Socket.IO.",
  },
];

/** Grid fitur AWOS (dari modul yang sudah live). */
export function FeatureGrid() {
  return (
    <section id="fitur" className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Semua yang tim butuhkan untuk kerja jarak jauh
          </h2>
          <p className="mt-3 text-muted-foreground">
            Operasional, kolaboratif, dan terukur — dalam satu platform internal.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
