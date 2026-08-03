"use client";

import { coconutSection } from "@/data/site-content";
import { Container } from "@/components/ui/Container";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { cn } from "@/lib/cn";

/**
 * Brief sensory flavor beat — atmosphere + one taste idea.
 * No specs, no full can, no left-text / right-product layout.
 */
export function FlavorScene() {
  const { prefersReducedMotion } = useMotionPreferences();

  return (
    <section
      id="sabor"
      data-scene="flavor"
      className="relative overflow-hidden bg-[#0a7f9c] py-16 text-pw-white md:py-20"
      aria-label="Sabor coco"
    >
      {/* Abstract condensation / wave layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className={cn(
            "absolute -left-[20%] top-[10%] h-[70%] w-[70%] rounded-full bg-[radial-gradient(circle,rgba(238,248,247,0.18),transparent_68%)]",
            !prefersReducedMotion && "animate-flavor-drift-a",
          )}
        />
        <div
          className={cn(
            "absolute -right-[15%] bottom-[-20%] h-[65%] w-[55%] rounded-full bg-[radial-gradient(circle,rgba(183,243,51,0.14),transparent_70%)]",
            !prefersReducedMotion && "animate-flavor-drift-b",
          )}
        />
        <svg
          className="absolute inset-x-0 bottom-0 h-[45%] w-full opacity-40"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            className={cn(!prefersReducedMotion && "animate-flavor-wave")}
            fill="rgba(238,248,247,0.12)"
            d="M0,192L80,186.7C160,181,320,171,480,181.3C640,192,800,224,960,224C1120,224,1280,192,1360,176L1440,160L1440,320L0,320Z"
          />
          <path
            fill="rgba(7,26,56,0.12)"
            d="M0,256L120,240C240,224,480,192,720,197.3C960,203,1200,245,1320,266.7L1440,288L1440,320L0,320Z"
          />
        </svg>
        {/* Condensation dots */}
        <span className="absolute left-[12%] top-[28%] h-1.5 w-1.5 rounded-full bg-white/35" />
        <span className="absolute left-[18%] top-[36%] h-1 w-1 rounded-full bg-white/25" />
        <span className="absolute right-[22%] top-[24%] h-2 w-2 rounded-full bg-white/20" />
        <span className="absolute right-[28%] top-[40%] h-1 w-1 rounded-full bg-white/30" />
      </div>

      <Container className="relative z-10 max-w-3xl text-center">
        <p className="text-[0.7rem] uppercase tracking-[0.28em] text-white/70">
          {coconutSection.eyebrow}
        </p>
        <h2 className="mt-5 font-display text-[clamp(2rem,5.5vw,3.75rem)] font-bold uppercase leading-[1.05] tracking-[-0.03em] text-pw-white">
          {coconutSection.title}
        </h2>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-white/75 md:text-xl">
          {coconutSection.text}
        </p>
      </Container>
    </section>
  );
}
