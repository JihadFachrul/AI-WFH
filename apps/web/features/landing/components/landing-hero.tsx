"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon, ShieldCheckIcon, CheckIcon } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { AnimatedBorderButton } from "@/components/ui/animated-border-button";
import { ProductPreview } from "./product-preview";

const POINTS = ["Tanpa surveillance", "Setup cepat", "Realtime"];

/** Hero landing AWOS: 2 kolom (copy + preview) di atas Aurora. */
export function LandingHero() {
  return (
    <AuroraBackground className="min-h-[92vh] px-4 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 text-center lg:text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-secondary-foreground backdrop-blur-sm">
            <ShieldCheckIcon className="size-3.5" />
            AI Workforce Operating System
          </span>

          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground md:text-5xl xl:text-6xl">
            Work From Anywhere,
            <br />
            <span className="text-primary">tetap accountable.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg lg:mx-0">
            AWOS adalah sistem operasi tenaga kerja: kelola tugas, bukti kerja,
            review manager, dan KPI tim dalam satu platform — produktivitas
            terukur, bukan diawasi.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <AnimatedBorderButton href="/login">
              Masuk ke AWOS
              <ArrowRightIcon className="size-4" />
            </AnimatedBorderButton>
            <Button size="lg" variant="ghost" asChild>
              <Link href="#alur">Lihat cara kerja</Link>
            </Button>
          </div>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground lg:justify-start">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-1.5">
                <CheckIcon className="size-4 text-primary" />
                {p}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
          className="relative z-10"
        >
          <ProductPreview />
        </motion.div>
      </div>
    </AuroraBackground>
  );
}
