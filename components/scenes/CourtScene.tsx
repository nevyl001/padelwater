"use client";

import { useRef } from "react";
import { consumptionMoments } from "@/data/site-content";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CourtField } from "@/components/atmosphere/CourtField";
import { TextReveal } from "@/components/motion/TextReveal";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { useCourtSceneTimeline } from "@/components/scenes/useCourtSceneTimeline";
import { cn } from "@/lib/cn";

const panelTones = [
  { bg: "bg-pw-navy text-pw-white", court: "dark" as const },
  { bg: "bg-pw-water text-pw-white", court: "water" as const },
  { bg: "bg-pw-lime-soft text-pw-navy", court: "lime" as const },
] as const;

/**
 * The court itself as setting — antes/durante/después. Desktop keeps
 * the horizontal pin+scrub track (the slide itself is the reveal);
 * mobile's stacked cards route their label through the shared
 * MaskReveal system instead of a one-off fade.
 */
export function CourtScene() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileStackRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion, isMobile, ready } = useMotionPreferences();
  const animateCourt = ready && !prefersReducedMotion;

  useCourtSceneTimeline({ rootRef, trackRef, mobileStackRef }, { ready, prefersReducedMotion, isMobile });

  return (
    <section
      ref={rootRef}
      data-scene="court"
      className={cn(
        "relative bg-pw-ice",
        "md:h-svh md:overflow-hidden",
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
        <Container className="relative z-10 shrink-0 max-md:px-6 max-md:pt-14 max-md:text-center md:text-left">
          <SectionLabel>Momento de consumo</SectionLabel>
          <TextReveal
            as="h2"
            variant="section"
            text="Antes. Durante. Después."
            splitBy="words"
            className="mt-3 max-w-3xl text-pw-navy md:mt-4"
          />
        </Container>

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
                <CourtField tone={tone.court} intensity="soft" animated={animateCourt} />
                <div className="relative z-20 max-w-md">
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

        <div
          ref={mobileStackRef}
          className={cn(
            "mt-8 space-y-0",
            prefersReducedMotion ? "md:mt-12 md:block" : "md:hidden",
          )}
        >
          {consumptionMoments.map((moment, index) => {
            const tone = panelTones[index];
            return (
              <article
                key={moment.id}
                data-moment-card
                className={cn(
                  "relative min-h-[70svh] overflow-hidden px-6 py-16 sm:px-10",
                  tone.bg,
                )}
              >
                <CourtField tone={tone.court} intensity="medium" animated={animateCourt} />
                <div className="relative z-20 mx-auto flex max-w-md flex-col justify-end">
                  <p
                    data-moment-eyebrow
                    className="text-xs uppercase tracking-[0.28em] opacity-55"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <TextReveal
                    as="h3"
                    mode="manual"
                    lines={[`${moment.label}.`]}
                    className="mt-3 font-display text-[clamp(2.5rem,12vw,3.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em]"
                  />
                  <p
                    data-moment-text
                    className="mt-4 text-base leading-relaxed opacity-80"
                  >
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
