"use client";

import { cn } from "@/lib/utils";
import React, { type CSSProperties, type ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

/**
 * Aurora background — pita cahaya bergerak halus untuk hero landing.
 * Diadaptasi ke Tailwind v4 (tanpa plugin/config): warna gradient di-set via
 * CSS var lokal memakai palet AWOS (navy + indigo + lavender). Light-only.
 */
export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  style,
  ...props
}: AuroraBackgroundProps) => {
  // Variabel warna yang dirujuk gradient di bawah (AWOS Aurora palette).
  const auroraVars = {
    "--white": "#ffffff",
    "--black": "#0f172a",
    "--transparent": "transparent",
    "--blue-300": "#93c5fd",
    "--blue-400": "#3257e8",
    "--blue-500": "#1e3a8a",
    "--indigo-300": "#a5b4fc",
    "--violet-200": "#ddd6fe",
  } as CSSProperties;

  return (
    <div
      style={{ ...auroraVars, ...style }}
      className={cn(
        "relative flex flex-col items-center justify-center bg-background text-foreground transition-bg",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            `pointer-events-none absolute -inset-[10px] opacity-50 blur-[10px] invert filter will-change-transform
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [background-image:var(--white-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            after:absolute after:inset-0 after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference after:content-[""]
            after:[background-image:var(--white-gradient),var(--aurora)]
            after:[background-size:200%,_100%]`,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`,
          )}
        ></div>
      </div>
      {children}
    </div>
  );
};
