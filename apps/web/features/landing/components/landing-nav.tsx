"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Top nav landing: logo AWOS + tombol Masuk. */
export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary font-display text-base font-bold text-primary-foreground shadow-sm shadow-primary/30">
            A
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-base font-bold tracking-tight">
              AWOS
            </span>
            <span className="mt-0.5 text-[11px] font-medium text-muted-foreground">
              Workforce OS
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
          <Link href="#alur" className="transition-colors hover:text-foreground">
            Alur kerja
          </Link>
          <Link href="#cara" className="transition-colors hover:text-foreground">
            Cara kerja
          </Link>
          <Link
            href="#fitur"
            className="transition-colors hover:text-foreground"
          >
            Fitur
          </Link>
          <Link href="#faq" className="transition-colors hover:text-foreground">
            FAQ
          </Link>
        </nav>

        <Button asChild>
          <Link href="/login">Masuk</Link>
        </Button>
      </div>
    </header>
  );
}
