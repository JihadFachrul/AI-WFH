const ITEMS = [
  {
    quote:
      "Sejak pakai AWOS, kami tidak lagi menebak progres. Semua tugas, bukti, dan review ada di satu tempat.",
    name: "Dewi Anggraini",
    role: "Operations Lead",
  },
  {
    quote:
      "KPI otomatis menghemat berjam-jam rekap manual tiap bulan. Review jadi berbasis data nyata.",
    name: "Bagas Pratama",
    role: "Engineering Manager",
  },
  {
    quote:
      "Tim remote kami tetap akuntabel tanpa merasa diawasi. Itu pembeda terbesarnya.",
    name: "Sari Wibowo",
    role: "HR Director",
  },
];

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Testimoni (placeholder ilustrasi). */
export function Testimonials() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Dipakai tim yang mengutamakan output
          </h2>
          <p className="mt-3 text-muted-foreground">
            Kutipan ilustrasi untuk menggambarkan nilai AWOS.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {ITEMS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <blockquote className="flex-1 text-sm leading-relaxed text-foreground">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {initials(t.name)}
                </span>
                <span className="text-sm leading-tight">
                  <span className="block font-semibold">{t.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {t.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
