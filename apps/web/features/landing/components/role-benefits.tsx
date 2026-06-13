import { UserIcon, UsersIcon, ShieldIcon } from "lucide-react";

const ROLES = [
  {
    icon: UserIcon,
    role: "Employee",
    desc: "Fokus kerja, bukan lapor manual.",
    points: [
      "Lihat tugas & prioritas sendiri",
      "Catat work log + unggah evidence",
      "Pantau KPI pribadi",
    ],
  },
  {
    icon: UsersIcon,
    role: "Manager",
    desc: "Visibilitas penuh tanpa micromanage.",
    points: [
      "Review & approve hasil kerja",
      "Lihat presence & beban tim",
      "Bandingkan performa tim",
    ],
  },
  {
    icon: ShieldIcon,
    role: "Admin / Direktur",
    desc: "Kontrol organisasi & jadwal.",
    points: [
      "Kelola user, role, departemen",
      "Kalender & agenda direktur",
      "Pantau KPI seluruh organisasi",
    ],
  },
];

/** Manfaat per peran — untuk pembeli enterprise. */
export function RoleBenefits() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          Satu platform, manfaat untuk setiap peran
        </h2>
        <p className="mt-3 text-muted-foreground">
          Dari anggota tim sampai direktur — semua dapat yang relevan.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {ROLES.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.role}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">
                {r.role}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
              <ul className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                {r.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
