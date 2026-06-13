"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { LandingNav } from "@/features/landing/components/landing-nav";
import { LandingHero } from "@/features/landing/components/landing-hero";
import { StatsBar } from "@/features/landing/components/stats-bar";
import { ProblemSolution } from "@/features/landing/components/problem-solution";
import { ValueChain } from "@/features/landing/components/value-chain";
import { HowItWorks } from "@/features/landing/components/how-it-works";
import { FeatureGrid } from "@/features/landing/components/feature-grid";
import { RoleBenefits } from "@/features/landing/components/role-benefits";
import { Testimonials } from "@/features/landing/components/testimonials";
import { Faq } from "@/features/landing/components/faq";
import { LandingCta } from "@/features/landing/components/landing-cta";

/**
 * Landing page (publik, sebelum login). Jika user sudah login → arahkan ke
 * /dashboard. Guest melihat landing SaaS lengkap dengan CTA ke /login.
 */
export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (hasHydrated && isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Memuat…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main>
        <LandingHero />
        <StatsBar />
        <ProblemSolution />
        <ValueChain />
        <HowItWorks />
        <FeatureGrid />
        <RoleBenefits />
        <Testimonials />
        <Faq />
        <LandingCta />
      </main>
    </div>
  );
}
