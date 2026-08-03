"use client";

import { coconutSection } from "@/data/site-content";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { cn } from "@/lib/cn";

/**
 * Brief sensory beat — taste as atmosphere, not information.
 */
export function FlavorScene() {
  const { prefersReducedMotion } = useMotionPreferences();

  return (
    <section
      id="sabor"
      data-scene="flavor"
      className="relative overflow-hidden bg-pw-water py-16 text-pw-white md:py-24"
      aria-label="Sabor coco"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(238,248,247,0.14),transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(183,243,51,0.1),transparent_45%),linear-gradient(180deg,rgba(3,17,38,0.2),transparent_42%,rgba(3,17,38,0.28))]"
      />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className={cn(
            "absolute -left-[18%] top-[5%] h-[75%] w-[65%] rounded-full bg-[radial-gradient(circle,rgba(238,248,247,0.12),transparent_70%)] blur-3xl",
            !prefersReducedMotion && "animate-flavor-drift-a",
          )}
        />
        <div
          className={cn(
            "absolute -right-[12%] bottom-[-25%] h-[70%] w-[50%] rounded-full bg-[radial-gradient(circle,rgba(0,169,203,0.18),transparent_72%)] blur-3xl",
            !prefersReducedMotion && "animate-flavor-drift-b",
          )}
        />
        <svg
          className="absolute inset-x-0 bottom-0 h-[50%] w-full opacity-30"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            className={cn(!prefersReducedMotion && "animate-flavor-wave")}
            fill="rgba(238,248,247,0.12)"
            d="M0,192L80,186.7C160,181,320,171,480,181.3C640,192,800,224,960,224C1120,224,1280,192,1360,176L1440,160L1440,320L0,320Z"
          />
        </svg>
      </div>

      <Container className="relative z-10 max-w-2xl text-center">
        <SectionLabel tone="light">{coconutSection.eyebrow}</SectionLabel>
        <h2 className="mt-5 text-editorial text-pw-white md:mt-6">
          {coconutSection.title}
        </h2>
        <p className="mx-auto mt-5 max-w-sm text-base leading-relaxed text-white/80 md:mt-7 md:max-w-md md:text-lg">
          {coconutSection.text}
        </p>
      </Container>
    </section>
  );
}
