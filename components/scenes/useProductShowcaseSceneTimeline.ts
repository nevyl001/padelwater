"use client";

import { useEffect, type RefObject } from "react";
import { applyMediaExpansion, prepareMediaExpansion } from "@/components/motion/mediaExpansion";

type ProductShowcaseSceneRefs = {
  rootRef: RefObject<HTMLElement | null>;
  canRef: RefObject<HTMLDivElement | null>;
  headlineRef: RefObject<HTMLElement | null>;
  statsRef: RefObject<HTMLElement | null>;
  ctaRef: RefObject<HTMLElement | null>;
};

type ProductShowcaseSceneFlags = {
  ready: boolean;
  prefersReducedMotion: boolean;
};

/**
 * One-shot entrance (not pinned) — the can settles into place the same
 * "just physical enough" way as the Story scene's opening, so the two
 * scenes read as one motion language without literally sharing a
 * timeline.
 */
export function useProductShowcaseSceneTimeline(
  refs: ProductShowcaseSceneRefs,
  flags: ProductShowcaseSceneFlags,
) {
  const { ready, prefersReducedMotion } = flags;

  useEffect(() => {
    if (!ready || prefersReducedMotion) return;

    const root = refs.rootRef.current;
    const can = refs.canRef.current;
    const headline = refs.headlineRef.current;
    const stats = refs.statsRef.current;
    const cta = refs.ctaRef.current;
    if (!root || !can || !headline || !stats || !cta) return;

    const rootEl = root;
    const canEl = can;
    const headlineEl = headline;
    const statsEl = stats;
    const ctaEl = cta;

    let dead = false;
    let revert: (() => void) | undefined;

    async function boot() {
      const { getGsap } = await import("@/lib/animation/gsap");
      const { gsap, ScrollTrigger } = getGsap();
      if (dead) return;

      const ctx = gsap.context(() => {
        const reflection = canEl.querySelector("[data-product-reflection]");
        const sheen = canEl.querySelector("[data-highlight-sheen]");
        const headlineUnits = headlineEl.querySelectorAll("[data-mask-unit]");
        const statsUnits = statsEl.querySelectorAll("[data-mask-unit]");
        const ctaUnits = ctaEl.querySelectorAll("[data-mask-unit]");

        prepareMediaExpansion(gsap, canEl);
        if (reflection) gsap.set(reflection, { opacity: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: rootEl, start: "top 70%", once: true },
        });

        applyMediaExpansion(tl, canEl, {
          from: { rotateX: -8, scale: 0.92, y: 24, opacity: 0 },
          to: { rotateX: 0, scale: 1, y: 0, opacity: 1 },
          duration: 0.9,
          position: 0,
        })
          .to(reflection, { opacity: 1, duration: 0.3 }, 0.5)
          .fromTo(
            headlineUnits,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
            0.15,
          )
          .fromTo(
            statsUnits,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.5 },
            0.5,
          )
          .fromTo(
            ctaUnits,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.5 },
            0.65,
          );

        if (sheen) {
          tl.fromTo(
            sheen,
            { x: "-130%", opacity: 0 },
            { x: "230%", opacity: 1, duration: 0.55, ease: "power2.inOut" },
            0.6,
          );
        }
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
  }, [
    ready,
    prefersReducedMotion,
    refs.rootRef,
    refs.canRef,
    refs.headlineRef,
    refs.statsRef,
    refs.ctaRef,
  ]);
}
