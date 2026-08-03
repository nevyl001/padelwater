"use client";

import { useEffect, useRef } from "react";
import { consumptionMoments } from "@/data/site-content";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CourtField } from "@/components/atmosphere/CourtField";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { cn } from "@/lib/cn";

const panelTones = [
  {
    bg: "bg-pw-navy text-pw-white",
    court: "dark" as const,
  },
  {
    bg: "bg-pw-water text-pw-white",
    court: "water" as const,
  },
  {
    bg: "bg-pw-lime-soft text-pw-navy",
    court: "lime" as const,
  },
] as const;

export function ConsumptionMoments() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion, isMobile, ready } = useMotionPreferences();

  useEffect(() => {
    const rootEl = rootRef.current;
    const trackEl = trackRef.current;
    if (!ready || !rootEl || !trackEl || prefersReducedMotion || isMobile) {
      return;
    }

    const root = rootEl;
    const track = trackEl;
    let reverted: (() => void) | undefined;

    async function run() {
      const { getGsap } = await import("@/lib/animation/gsap");
      const { gsap, ScrollTrigger } = getGsap();

      const totalScroll = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      const ctx = gsap.context(() => {
        gsap.to(track, {
          x: () => -totalScroll(),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${Math.max(totalScroll(), window.innerHeight * 0.85)}`,
            pin: true,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, root);

      reverted = () => {
        ctx.revert();
        ScrollTrigger.getAll()
          .filter((t) => t.trigger === root)
          .forEach((t) => t.kill());
      };
    }

    void run();
    return () => reverted?.();
  }, [prefersReducedMotion, isMobile, ready]);

  return (
    <section
      ref={rootRef}
      className={cn(
        "relative bg-pw-ice",
        "md:h-svh md:overflow-hidden",
        "max-md:section-pad",
        prefersReducedMotion && "md:h-auto md:overflow-visible md:section-pad",
      )}
      aria-label="Momentos de consumo"
    >
      <div
        className={cn(
          "flex flex-col",
          "md:h-full md:pt-[calc(var(--header-height)+1.5rem)] md:pb-0",
          prefersReducedMotion && "md:h-auto md:pt-0 md:pb-0",
        )}
      >
        <Container className="relative z-10 shrink-0 max-md:text-center md:text-left">
          <SectionLabel>Momento de consumo</SectionLabel>
          <h2 className="mt-3 max-w-3xl font-display text-[clamp(2rem,4.5vw,3.75rem)] font-bold uppercase leading-[1.02] tracking-[-0.03em] text-pw-navy md:mt-4">
            Antes. Durante. Después.
          </h2>
        </Container>

        {/* Desktop: full-bleed horizontal moments */}
        <div
          ref={trackRef}
          className={cn(
            "mt-8 hidden min-h-0 w-max flex-1 pl-[max(2rem,calc((100vw-85rem)/2))]",
            prefersReducedMotion ? "md:hidden" : "md:flex",
          )}
        >
          {consumptionMoments.map((moment, index) => {
            const tone = panelTones[index];
            return (
              <article
                key={moment.id}
                className={cn(
                  "relative flex h-full w-[min(92vw,42rem)] shrink-0 flex-col justify-end overflow-hidden px-12 pb-14 pt-20 sm:px-14",
                  tone.bg,
                )}
              >
                <CourtField tone={tone.court} intensity="soft" animated={false} />
                <div className="relative z-10 max-w-md">
                  <p className="text-xs uppercase tracking-[0.28em] opacity-55">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em]">
                    {moment.label}.
                  </h3>
                  <p className="mt-5 max-w-sm text-base leading-relaxed opacity-80 md:text-lg">
                    {moment.text}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Mobile + reduced-motion */}
        <div
          className={cn(
            "mt-10 space-y-0",
            prefersReducedMotion ? "md:mt-12 md:block" : "md:hidden",
          )}
        >
          {consumptionMoments.map((moment, index) => {
            const tone = panelTones[index];
            return (
              <article
                key={moment.id}
                className={cn(
                  "relative overflow-hidden px-6 py-14 sm:px-10",
                  tone.bg,
                )}
              >
                <CourtField tone={tone.court} intensity="soft" animated={false} />
                <div className="relative z-10 mx-auto max-w-md">
                  <p className="text-xs uppercase tracking-[0.28em] opacity-55">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(2.25rem,10vw,3.25rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em]">
                    {moment.label}.
                  </h3>
                  <p className="mt-4 text-base leading-relaxed opacity-80">
                    {moment.text}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
