import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Penutup CTA + footer ringkas. */
export function LandingCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
      <div className="overflow-hidden rounded-2xl border border-border bg-primary px-6 py-14 text-center text-primary-foreground shadow-sm">
        <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          Siap kerja dari mana saja, tetap terukur?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-primary-foreground/80 md:text-base">
          Masuk dengan akun internal Anda untuk mulai mengelola tugas, bukti
          kerja, dan performa tim.
        </p>
        <Button size="lg" variant="secondary" className="mt-7" asChild>
          <Link href="/login">
            Masuk ke AWOS
            <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      </div>

      <footer className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
        <span className="font-display font-semibold text-foreground">
          AWOS
        </span>
        <span>AI Workforce Operating System — platform internal.</span>
      </footer>
    </section>
  );
}
