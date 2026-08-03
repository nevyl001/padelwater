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

export function ConsumptionMoments() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion, isMobile, ready } = useMotionPreferences();

  useEffect(() => {
    const rootEl = rootRef.current;
    const trackEl = trackRef.current;
    if (!ready || !rootEl || !trackEl || prefersReducedMotion || isMobile) return;

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
            end: () => `+=${totalScroll()}`,
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
      className="relative overflow-hidden bg-pw-ice"
      aria-label="Momentos de consumo"
    >
      <div className="section-pad pb-8 md:pb-10">
        <Container>
          <SectionLabel>Momento de consumo</SectionLabel>
          <h2 className="mt-4 max-w-3xl text-editorial text-pw-navy">
            Antes. Durante. Después.
          </h2>
        </Container>
      </div>

      {/* Desktop horizontal track */}
      <div
        ref={trackRef}
        className={cn(
          "hidden md:flex w-max gap-6 px-[max(1.75rem,calc((100vw-85rem)/2))] pb-24",
          (prefersReducedMotion || isMobile) && "md:hidden",
        )}
      >
        {consumptionMoments.map((moment, index) => (
          <article
            key={moment.id}
            className={cn(
              "flex h-[58vh] w-[min(78vw,42rem)] flex-col justify-between rounded-sm p-8 md:p-12",
              panelTones[index],
            )}
          >
            <p className="text-xs uppercase tracking-[0.24em] opacity-60">
              {moment.label}
            </p>
            <div>
              <h3 className="text-editorial">{moment.label}.</h3>
              <p className="mt-5 max-w-md text-body-lg opacity-80">
                {moment.text}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Mobile / reduced: vertical stack */}
      <div className="container-pw space-y-5 pb-20 md:hidden">
        {consumptionMoments.map((moment, index) => (
          <article
            key={moment.id}
            className={cn(
              "flex min-h-[22rem] flex-col justify-between rounded-sm p-8",
              panelTones[index],
            )}
          >
            <p className="text-xs uppercase tracking-[0.24em] opacity-60">
              {moment.label}
            </p>
            <div>
              <h3 className="text-section">{moment.label}.</h3>
              <p className="mt-4 text-body-lg opacity-80">{moment.text}</p>
            </div>
          </article>
        ))}
      </div>

      {prefersReducedMotion ? (
        <div className="container-pw hidden space-y-5 pb-24 md:block">
          {consumptionMoments.map((moment, index) => (
            <article
              key={`reduced-${moment.id}`}
              className={cn(
                "flex min-h-[20rem] flex-col justify-between rounded-sm p-10",
                panelTones[index],
              )}
            >
              <h3 className="text-section">{moment.label}.</h3>
              <p className="mt-4 max-w-xl text-body-lg opacity-80">
                {moment.text}
              </p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
