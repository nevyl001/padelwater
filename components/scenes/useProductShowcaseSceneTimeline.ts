"use client";

import { useEffect, type RefObject } from "react";
import { durations, gsapEasings } from "@/lib/motion";
import { applyMediaExpansion, prepareMediaExpansion } from "@/components/motion/mediaExpansion";

type ProductShowcaseSceneRefs = {
  rootRef: RefObject<HTMLElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  canRef: RefObject<HTMLDivElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
};

type ProductShowcaseSceneFlags = {
  ready: boolean;
  prefersReducedMotion: boolean;
};

/**
 * Entrance for the immersive showcase — stage + panel settle into place.
 * Attribute swaps are handled in the scene (CSS/Motion), not here.
 */
export function useProductShowcaseSceneTimeline(
  refs: ProductShowcaseSceneRefs,
  flags: ProductShowcaseSceneFlags,
) {
  const { ready, prefersReducedMotion } = flags;

  useEffect(() => {
    if (!ready || prefersReducedMotion) return;

    const root = refs.rootRef.current;
    const stage = refs.stageRef.current;
    const can = refs.canRef.current;
    const panel = refs.panelRef.current;
    if (!root || !stage || !can || !panel) return;

    const rootEl = root;
    const stageEl = stage;
    const canEl = can;
    const panelEl = panel;

    let dead = false;
    let revert: (() => void) | undefined;

    async function boot() {
      const { getGsap } = await import("@/lib/animation/gsap");
      const { gsap, ScrollTrigger } = getGsap();
      if (dead) return;

      const ctx = gsap.context(() => {
        const orbits = stageEl.querySelector("[data-orbital-rings]");
        const reflection = canEl.querySelector("[data-product-reflection]");
        const sheen = canEl.querySelector("[data-highlight-sheen]");

        prepareMediaExpansion(gsap, canEl);
        gsap.set(panelEl, { opacity: 0, y: 24 });
        gsap.set(stageEl, { opacity: 0 });
        if (orbits) gsap.set(orbits, { opacity: 0, scale: 0.94 });
        if (reflection) gsap.set(reflection, { opacity: 0 });

        const tl = gsap.timeline({
          defaults: { ease: gsapEasings.outExpo },
          scrollTrigger: { trigger: rootEl, start: "top 72%", once: true },
        });

        tl.to(stageEl, { opacity: 1, duration: durations.base }, 0);

        if (orbits) {
          tl.to(
            orbits,
            { opacity: 1, scale: 1, duration: durations.cinematic },
            0.06,
          );
        }

        applyMediaExpansion(tl, canEl, {
          from: { rotateX: -5, scale: 0.92, y: 28, opacity: 0 },
          to: { rotateX: 0, scale: 1, y: 0, opacity: 1 },
          duration: durations.cinematic,
          position: 0.1,
        });

        if (reflection) {
          tl.to(reflection, { opacity: 1, duration: durations.base }, 0.52);
        }
        if (sheen) {
          tl.fromTo(
            sheen,
            { x: "-130%", opacity: 0 },
            {
              x: "230%",
              opacity: 1,
              duration: durations.sheen,
              ease: gsapEasings.inOut,
            },
            0.58,
          );
        }

        tl.to(
          panelEl,
          { opacity: 1, y: 0, duration: durations.reveal },
          0.32,
        );

        gsap.to(stageEl, {
          y: -14,
          ease: gsapEasings.none,
          scrollTrigger: {
            trigger: rootEl,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
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
    refs.stageRef,
    refs.canRef,
    refs.panelRef,
  ]);
}
