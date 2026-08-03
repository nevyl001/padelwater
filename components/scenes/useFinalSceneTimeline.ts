"use client";

import { useEffect, type RefObject } from "react";
import { durations, gsapEasings, staggers } from "@/lib/motion";

type FinalSceneRefs = {
  rootRef: RefObject<HTMLElement | null>;
  headlineRef: RefObject<HTMLElement | null>;
  ctaRef: RefObject<HTMLElement | null>;
};

type FinalSceneFlags = {
  ready: boolean;
  prefersReducedMotion: boolean;
};

/** Compact final entrance — headline then CTA. */
export function useFinalSceneTimeline(refs: FinalSceneRefs, flags: FinalSceneFlags) {
  const { ready, prefersReducedMotion } = flags;

  useEffect(() => {
    if (!ready || prefersReducedMotion) return;

    const root = refs.rootRef.current;
    const headline = refs.headlineRef.current;
    const cta = refs.ctaRef.current;
    if (!root || !headline || !cta) return;

    const rootEl = root;
    const headlineEl = headline;
    const ctaEl = cta;

    let dead = false;
    let revert: (() => void) | undefined;

    async function boot() {
      const { getGsap } = await import("@/lib/animation/gsap");
      const { gsap, ScrollTrigger } = getGsap();
      if (dead) return;

      const ctx = gsap.context(() => {
        const headlineUnits = headlineEl.querySelectorAll("[data-mask-unit]");
        const ctaUnits = ctaEl.querySelectorAll("[data-mask-unit]");

        const tl = gsap.timeline({
          defaults: { ease: gsapEasings.outExpo },
          scrollTrigger: { trigger: rootEl, start: "top 70%", once: true },
        });

        tl.fromTo(
          headlineUnits,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: durations.reveal,
            stagger: staggers.soft,
          },
          0,
        ).fromTo(
          ctaUnits,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: durations.mid },
          0.32,
        );
      }, rootEl);

      revert = () => {
        ctx.revert();
        ScrollTrigger.getAll()
          .filter((t) => t.trigger === rootEl)
          .forEach((t) => t.kill());
      };
    }

    void boot();
    return () => {
      dead = true;
      revert?.();
    };
  }, [ready, prefersReducedMotion, refs.rootRef, refs.headlineRef, refs.ctaRef]);
}
