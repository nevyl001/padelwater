"use client";

import { coconutSection } from "@/data/site-content";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BrandDiagonals } from "@/components/atmosphere/BrandDiagonals";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { cn } from "@/lib/cn";

/**
 * Sensory beat — packaging diagonals + cyan/lime energy, not a label reprint.
 */
export function FlavorScene() {
  const { prefersReducedMotion } = useMotionPreferences();

  return (
    <section
      id="sabor"
      data-scene="flavor"
      className="relative overflow-hidden bg-pw-navy py-16 text-pw-white md:py-24"
      aria-label="Sabor coco"
    >
      <BrandDiagonals intensity="bold" tone="navy" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_28%_18%,rgba(0,174,239,0.28),transparent_48%),radial-gradient(ellipse_at_82%_78%,rgba(191,215,69,0.18),transparent_46%),linear-gradient(180deg,rgba(12,16,40,0.35),transparent_45%,rgba(12,16,40,0.55))]"
      />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className={cn(
            "absolute -left-[18%] top-[5%] h-[75%] w-[65%] rounded-full bg-[radial-gradient(circle,rgba(0,169,203,0.22),transparent_70%)] blur-3xl",
            !prefersReducedMotion && "animate-flavor-drift-a",
          )}
        />
        <div
          className={cn(
            "absolute -right-[12%] bottom-[-25%] h-[70%] w-[50%] rounded-full bg-[radial-gradient(circle,rgba(191,215,69,0.2),transparent_72%)] blur-3xl",
            !prefersReducedMotion && "animate-flavor-drift-b",
          )}
        />
      </div>

      <Container className="relative z-10 max-w-2xl text-center">
        <SectionLabel tone="lime">{coconutSection.eyebrow}</SectionLabel>
        <h2 className="mt-5 text-editorial text-pw-white md:mt-6">
          {coconutSection.title}
        </h2>
        <div
          aria-hidden
          className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-pw-cyan via-pw-lime to-transparent md:mt-6"
        />
        <p className="mx-auto mt-5 max-w-sm text-base leading-relaxed text-white/80 md:mt-7 md:max-w-md md:text-lg">
          {coconutSection.text}
        </p>
      </Container>
    </section>
  );
}
