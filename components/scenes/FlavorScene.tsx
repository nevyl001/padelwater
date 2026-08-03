"use client";

import { coconutSection } from "@/data/site-content";
import { Container } from "@/components/ui/Container";
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
      className="relative overflow-hidden bg-[#087a96] py-14 text-pw-white md:py-16"
      aria-label="Sabor coco"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(238,248,247,0.16),transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(183,243,51,0.1),transparent_45%),linear-gradient(180deg,rgba(4,80,102,0.35),transparent_40%,rgba(3,17,38,0.25))]"
      />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className={cn(
            "absolute -left-[18%] top-[5%] h-[75%] w-[65%] rounded-full bg-[radial-gradient(circle,rgba(238,248,247,0.14),transparent_70%)]",
            !prefersReducedMotion && "animate-flavor-drift-a",
          )}
        />
        <div
          className={cn(
            "absolute -right-[12%] bottom-[-25%] h-[70%] w-[50%] rounded-full bg-[radial-gradient(circle,rgba(0,169,203,0.2),transparent_72%)]",
            !prefersReducedMotion && "animate-flavor-drift-b",
          )}
        />
        <svg
          className="absolute inset-x-0 bottom-0 h-[50%] w-full opacity-35"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            className={cn(!prefersReducedMotion && "animate-flavor-wave")}
            fill="rgba(238,248,247,0.14)"
            d="M0,192L80,186.7C160,181,320,171,480,181.3C640,192,800,224,960,224C1120,224,1280,192,1360,176L1440,160L1440,320L0,320Z"
          />
        </svg>
        <span className="absolute left-[14%] top-[30%] h-1.5 w-1.5 rounded-full bg-white/40" />
        <span className="absolute left-[20%] top-[38%] h-1 w-1 rounded-full bg-white/28" />
        <span className="absolute right-[24%] top-[26%] h-2 w-2 rounded-full bg-white/22" />
        <span className="absolute right-[30%] top-[42%] h-1 w-1 rounded-full bg-white/32" />
        <span className="absolute left-[48%] top-[22%] h-1 w-1 rounded-full bg-white/20" />
      </div>

      <Container className="relative z-10 max-w-2xl text-center">
        <p className="text-[0.65rem] uppercase tracking-[0.34em] text-white/75">
          {coconutSection.eyebrow}
        </p>
        <h2 className="mt-6 font-display text-[clamp(2.15rem,5.8vw,4rem)] font-bold uppercase leading-[1.02] tracking-[-0.035em] text-pw-white">
          {coconutSection.title}
        </h2>
        <p className="mx-auto mt-6 max-w-sm text-base leading-relaxed text-white/80 md:mt-7 md:max-w-md md:text-lg">
          {coconutSection.text}
        </p>
      </Container>
    </section>
  );
}
