"use client";

import { useEffect, useId, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { useReducedMotion } from "framer-motion";

interface SparklesProps {
  className?: string;
  size?: number;
  minSize?: number | null;
  density?: number;
  speed?: number;
  minSpeed?: number | null;
  opacity?: number;
  opacitySpeed?: number;
  minOpacity?: number | null;
  color?: string;
  background?: string;
}

/**
 * Lapisan partikel "sparkles" (tsparticles slim). Dekoratif — dimatikan saat
 * prefers-reduced-motion. Default warna navy AWOS, density rendah utk perf.
 */
export function Sparkles({
  className,
  size = 1.2,
  minSize = null,
  density = 320,
  speed = 1,
  minSpeed = null,
  opacity = 1,
  opacitySpeed = 3,
  minOpacity = null,
  color = "#1e3a8a",
  background = "transparent",
}: SparklesProps) {
  const [isReady, setIsReady] = useState(false);
  const reduce = useReducedMotion();
  const id = useId();

  useEffect(() => {
    if (reduce) return;
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => setIsReady(true));
  }, [reduce]);

  if (reduce || !isReady) return null;

  return (
    <Particles
      id={id}
      className={className}
      options={{
        background: { color: { value: background } },
        fullScreen: { enable: false, zIndex: 1 },
        fpsLimit: 120,
        particles: {
          color: { value: color },
          move: {
            enable: true,
            direction: "none",
            speed: { min: minSpeed || speed / 10, max: speed },
            straight: false,
          },
          number: { value: density },
          opacity: {
            value: { min: minOpacity || opacity / 10, max: opacity },
            animation: { enable: true, sync: false, speed: opacitySpeed },
          },
          size: { value: { min: minSize || size / 2.5, max: size } },
        },
        detectRetina: true,
      }}
    />
  );
}
