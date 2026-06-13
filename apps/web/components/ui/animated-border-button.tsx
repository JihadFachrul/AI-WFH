"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AnimatedBorderButtonProps {
  href: string;
  children: React.ReactNode;
  size?: "default" | "sm" | "lg";
  className?: string;
  /** radius sudut (px) agar jalur border pas dengan rounded tombol. */
  radius?: number;
  /** durasi 1 putaran (detik). */
  duration?: number;
}

/**
 * Tombol dengan garis tepi berjalar (traveling border) — aksen navy AWOS.
 * Reuse Button + Link (asChild). Hormati prefers-reduced-motion: border
 * statis bila motion dikurangi.
 */
export function AnimatedBorderButton({
  href,
  children,
  size = "lg",
  className,
  radius = 10,
  duration = 5,
}: AnimatedBorderButtonProps) {
  const reduce = useReducedMotion();

  return (
    <Button asChild variant="outline" size={size} className={cn("relative", className)}>
      <Link href={href}>
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute -inset-px rounded-[inherit] border-2 border-transparent",
            "[mask-clip:padding-box,border-box] [mask-composite:intersect]",
            "[mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]",
            // fallback statis saat reduced-motion
            reduce && "border-primary/50",
          )}
        >
          {!reduce && (
            <motion.span
              className="absolute aspect-square bg-gradient-to-r from-transparent via-primary to-primary"
              animate={{ offsetDistance: ["0%", "100%"] }}
              style={{
                width: 20,
                offsetPath: `rect(0 auto auto 0 round ${radius}px)`,
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration,
                ease: "linear",
              }}
            />
          )}
        </span>
        {children}
      </Link>
    </Button>
  );
}
