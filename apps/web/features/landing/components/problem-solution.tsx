import { XIcon, CheckIcon } from "lucide-react";

const PROBLEMS = [
  "Tidak tahu siapa kerja apa saat tim tersebar",
  "Progres hanya ketahuan saat deadline lewat",
  "Bukti kerja berserak di chat & email",
  "Performa dinilai berdasarkan perasaan, bukan data",
];

const SOLUTIONS = [
  "Status & presence tim terlihat real-time",
  "Work log harian + timeline progres tiap tugas",
  "Evidence terlampir langsung di tugasnya",
  "KPI dihitung otomatis dari aktivitas nyata",
];

/** Bagian Masalah WFA vs Solusi AWOS. */
export function ProblemSolution() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          Kerja dari mana saja sering bikin kabur
        </h2>
        <p className="mt-3 text-muted-foreground">
          AWOS mengubah ketidakpastian remote jadi visibilitas yang terukur.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-display text-base font-semibold text-destructive">
            Tanpa AWOS
          </h3>
          <ul className="mt-4 space-y-3">
            {PROBLEMS.map((p) => (
              <li key={p} className="flex gap-3 text-sm text-muted-foreground">
                <XIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 shadow-sm">
          <h3 className="font-display text-base font-semibold text-primary">
            Dengan AWOS
          </h3>
          <ul className="mt-4 space-y-3">
            {SOLUTIONS.map((s) => (
              <li key={s} className="flex gap-3 text-sm text-foreground">
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
