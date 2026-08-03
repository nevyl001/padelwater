"use client";

import { useEffect, type RefObject } from "react";
import { applyMediaExpansion, prepareMediaExpansion } from "@/components/motion/mediaExpansion";

type FinalSceneRefs = {
  rootRef: RefObject<HTMLElement | null>;
  canRef: RefObject<HTMLDivElement | null>;
  headlineRef: RefObject<HTMLElement | null>;
  ctaRef: RefObject<HTMLElement | null>;
};

type FinalSceneFlags = {
  ready: boolean;
  prefersReducedMotion: boolean;
};

/**
 * Closing scene — one-shot entrance, same recipe as the other scenes
 * (can settles physically, headline and CTA follow through the shared
 * mask-reveal system) so the site's last beat still reads as the same
 * system as its first.
 */
export function useFinalSceneTimeline(refs: FinalSceneRefs, flags: FinalSceneFlags) {
  const { ready, prefersReducedMotion } = flags;

  useEffect(() => {
    if (!ready || prefersReducedMotion) return;

    const root = refs.rootRef.current;
    const can = refs.canRef.current;
    const headline = refs.headlineRef.current;
    const cta = refs.ctaRef.current;
    if (!root || !can || !headline || !cta) return;

    const rootEl = root;
    const canEl = can;
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

        prepareMediaExpansion(gsap, canEl, "50% 50%");

        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: rootEl, start: "top 65%", once: true },
        });

        applyMediaExpansion(tl, canEl, {
          from: { rotateY: 8, scale: 0.9, opacity: 0 },
          to: { rotateY: 0, scale: 1, opacity: 1 },
          duration: 1,
          position: 0,
        }).fromTo(
          headlineUnits,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.05 },
          0.2,
        ).fromTo(
          ctaUnits,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.5 },
          0.55,
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
  }, [ready, prefersReducedMotion, refs.rootRef, refs.canRef, refs.headlineRef, refs.ctaRef]);
}
