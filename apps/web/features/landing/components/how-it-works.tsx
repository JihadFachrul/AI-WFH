const STEPS = [
  {
    n: "01",
    title: "Tetapkan & assign tugas",
    desc: "Manager membuat tugas, menetapkan prioritas dan penerima. Tim melihatnya langsung di Kanban.",
  },
  {
    n: "02",
    title: "Kerjakan & lampirkan bukti",
    desc: "Anggota mencatat work log harian dan mengunggah evidence — progres transparan tanpa diawasi.",
  },
  {
    n: "03",
    title: "Review & ukur performa",
    desc: "Manager menyetujui atau minta revisi. KPI tim terhitung otomatis jadi insight yang actionable.",
  },
];

/** Langkah pakai AWOS (3 step). */
export function HowItWorks() {
  return (
    <section id="cara" className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Mulai dalam tiga langkah
          </h2>
          <p className="mt-3 text-muted-foreground">
            Alur kerja yang sama untuk semua tim — sederhana dan konsisten.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="relative rounded-xl border border-border bg-card p-6 shadow-sm">
              <span className="font-display text-4xl font-bold text-primary/20">
                {s.n}
              </span>
              <h3 className="mt-2 font-display text-base font-semibold">
                {s.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
