"use client";

import { Sparkles } from "@/components/ui/sparkles";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

const METRICS = [
  { value: "10rb+", label: "Tugas terlacak" },
  { value: "99.9%", label: "Uptime platform" },
  { value: "6", label: "Metrik KPI otomatis" },
  { value: "<1 hari", label: "Waktu onboarding" },
];

// Wordmark placeholder (ilustrasi — bukan klien nyata).
const LOGOS = [
  "Nusantara Co",
  "Garda Tech",
  "Bahtera Group",
  "Sinar Digital",
  "Wira Logistik",
  "Cakra Finansial",
];

/** Bar metrik + barisan logo berjalan + glow sparkles (ilustrasi). */
export function StatsBar() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 pt-12 md:px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label} className="text-center">
              <p className="font-display text-3xl font-bold tabular-nums text-primary">
                {m.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Dipercaya tim operasional (ilustrasi)
        </p>

        <div className="relative mt-6 h-16 w-full">
          <InfiniteSlider className="flex h-full w-full items-center" duration={32} gap={56}>
            {LOGOS.map((l) => (
              <span
                key={l}
                className="whitespace-nowrap font-display text-xl font-bold text-muted-foreground/45"
              >
                {l}
              </span>
            ))}
          </InfiniteSlider>
          <ProgressiveBlur
            className="pointer-events-none absolute left-0 top-0 h-full w-32"
            direction="left"
            blurIntensity={1}
          />
          <ProgressiveBlur
            className="pointer-events-none absolute right-0 top-0 h-full w-32"
            direction="right"
            blurIntensity={1}
          />
        </div>
      </div>

      {/* glow arc + sparkles dekoratif */}
      <div className="relative -mt-4 h-48 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]">
        <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#1e3a8a,transparent_70%)] before:opacity-20" />
        <div className="absolute -left-1/2 top-1/2 z-10 aspect-[1/0.7] w-[200%] rounded-[100%] border-t border-border bg-card" />
        <Sparkles
          density={280}
          color="#1e3a8a"
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </div>
    </section>
  );
}
