const QA = [
  {
    q: "Apakah AWOS alat surveillance?",
    a: "Bukan. AWOS tidak memakai screenshot, GPS, atau keystroke. Fokusnya output kerja: tugas, bukti, review, dan KPI — akuntabilitas, bukan pengawasan.",
  },
  {
    q: "Bagaimana KPI dihitung?",
    a: "KPI dihitung dinamis dari data nyata: penyelesaian tugas, kepatuhan evidence, hasil review, work log, dan konsistensi sesi kerja. Tidak ada input skor manual.",
  },
  {
    q: "Apakah AWOS untuk tim kecil atau perusahaan besar?",
    a: "Keduanya. AWOS mendukung struktur peran (Employee, Manager, Admin, Super Admin) dan departemen, sehingga bisa tumbuh bersama organisasi.",
  },
  {
    q: "Apakah bisa rapat dan kalender?",
    a: "Ya. AWOS punya Meeting Scheduler dan Corporate Calendar yang menggabungkan meeting + event perusahaan dalam satu timeline.",
  },
  {
    q: "Bagaimana cara mulai?",
    a: "Klik Masuk dan gunakan akun internal yang diberikan organisasi Anda. Onboarding tim biasanya kurang dari satu hari.",
  },
];

/** FAQ pakai <details> native (aksesibel, tanpa JS tambahan). */
export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 md:px-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          Pertanyaan umum
        </h2>
        <p className="mt-3 text-muted-foreground">
          Hal yang sering ditanyakan tentang AWOS.
        </p>
      </div>

      <div className="mt-10 space-y-3">
        {QA.map((item) => (
          <details
            key={item.q}
            className="group rounded-xl border border-border bg-card p-5 shadow-sm [&_summary]:cursor-pointer"
          >
            <summary className="flex items-center justify-between gap-4 font-display text-base font-semibold marker:content-none">
              {item.q}
              <span className="shrink-0 text-primary transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
