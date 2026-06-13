import {
  ClipboardListIcon,
  PaperclipIcon,
  NotebookPenIcon,
  BadgeCheckIcon,
  GaugeIcon,
  BrainCircuitIcon,
  ChevronRightIcon,
} from "lucide-react";

const STEPS = [
  { icon: ClipboardListIcon, label: "Task", desc: "Tugas & assignment" },
  { icon: PaperclipIcon, label: "Evidence", desc: "Bukti output kerja" },
  { icon: NotebookPenIcon, label: "Work Log", desc: "Progress harian" },
  { icon: BadgeCheckIcon, label: "Manager Review", desc: "Approve / revisi" },
  { icon: GaugeIcon, label: "KPI Engine", desc: "Performa otomatis" },
  {
    icon: BrainCircuitIcon,
    label: "Workforce Intelligence",
    desc: "Insight AI",
  },
];

/** Core Value Chain AWOS — rantai data Task → … → Intelligence. */
export function ValueChain() {
  return (
    <section id="alur" className="mx-auto max-w-6xl px-4 py-20 md:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          Satu rantai data, dari tugas ke insight
        </h2>
        <p className="mt-3 text-muted-foreground">
          Setiap fitur AWOS menyumbang ke rantai yang sama — sehingga
          akuntabilitas terukur, bukan ditebak.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap items-stretch justify-center gap-3">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center gap-3">
              <div className="flex w-40 flex-col items-center rounded-xl border border-border bg-card p-4 text-center shadow-sm">
                <span className="mb-3 flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <Icon className="size-5" />
                </span>
                <span className="font-display text-sm font-semibold">
                  {s.label}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {s.desc}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRightIcon className="hidden size-5 shrink-0 text-muted-foreground/50 lg:block" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
