"use client";

import { useEffect, useRef } from "react";
import { consumptionMoments } from "@/data/site-content";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { cn } from "@/lib/cn";

const panelTones = [
  "bg-pw-navy text-pw-white",
  "bg-pw-water text-pw-white",
  "bg-pw-lime-soft text-pw-navy",
] as const;

function MomentCard({
  label,
  text,
  tone,
  compact,
}: {
  label: string;
  text: string;
  tone: string;
  compact?: boolean;
}) {
  return (
    <article
      className={cn(
        "flex flex-col justify-between rounded-sm",
        tone,
        compact
          ? "h-full w-[min(72vw,38rem)] p-8 md:p-10"
          : "min-h-[20rem] p-8 md:min-h-[22rem] md:p-10",
      )}
    >
      <p className="text-xs uppercase tracking-[0.24em] opacity-60">{label}</p>
      <div>
        <h3 className={compact ? "text-editorial" : "text-section"}>
          {label}.
        </h3>
        <p
          className={cn(
            "mt-4 text-body-lg opacity-80",
            compact ? "max-w-md" : "max-w-xl",
          )}
        >
          {text}
        </p>
      </div>
    </article>
  );
}

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
      const { getGsap } = await import("@/lib/gsap");
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
            end: () => `+=${Math.max(totalScroll(), window.innerHeight * 0.8)}`,
            pin: true,
            scrub: 0.6,
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
        // Desktop pin scene must fit exactly in the viewport so cards are not clipped
        "md:h-svh md:overflow-hidden",
        "max-md:section-pad",
        prefersReducedMotion && "md:h-auto md:overflow-visible md:section-pad",
      )}
      aria-label="Momentos de consumo"
    >
      <div
        className={cn(
          "flex flex-col",
          "md:h-full md:pt-[calc(var(--header-height)+1.25rem)] md:pb-8",
          prefersReducedMotion && "md:h-auto md:pt-0 md:pb-0",
        )}
      >
        <Container className="shrink-0">
          <SectionLabel>Momento de consumo</SectionLabel>
          <h2 className="mt-3 max-w-3xl text-editorial text-pw-navy md:mt-4">
            Antes. Durante. Después.
          </h2>
        </Container>

        {/* Desktop horizontal track */}
        <div
          ref={trackRef}
          className={cn(
            "mt-8 hidden min-h-0 w-max flex-1 gap-6 px-[max(1.75rem,calc((100vw-85rem)/2))]",
            prefersReducedMotion ? "md:hidden" : "md:flex",
          )}
        >
          {consumptionMoments.map((moment, index) => (
            <MomentCard
              key={moment.id}
              label={moment.label}
              text={moment.text}
              tone={panelTones[index]}
              compact
            />
          ))}
        </div>

        {/* Mobile + reduced-motion vertical stack */}
        <div
          className={cn(
            "container-pw mt-10 space-y-5",
            prefersReducedMotion ? "md:mt-14 md:block" : "md:hidden",
          )}
        >
          {consumptionMoments.map((moment, index) => (
            <MomentCard
              key={moment.id}
              label={moment.label}
              text={moment.text}
              tone={panelTones[index]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
