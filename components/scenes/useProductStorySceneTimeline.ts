"use client";

import { useEffect, useState, type RefObject } from "react";
import { applyMediaExpansion, prepareMediaExpansion } from "@/components/motion/mediaExpansion";

type ProductStorySceneRefs = {
  rootRef: RefObject<HTMLElement | null>;
  pinRef: RefObject<HTMLDivElement | null>;
  canRef: RefObject<HTMLDivElement | null>;
  stageRefs: RefObject<Array<HTMLDivElement | null>>;
  holdHintRef: RefObject<HTMLElement | null>;
};

type ProductStorySceneFlags = {
  ready: boolean;
  prefersReducedMotion: boolean;
  isMobile: boolean;
  storyVh: number;
};

// Stages 0–2: centered. Monument (470): stay put — CSS docks the can to the right.
const desktopCanStates: Array<{ x?: number; y?: number; scale?: number }> = [
  { x: 0, scale: 1 },
  { x: 0, scale: 1 },
  { x: 0, scale: 1 },
  { x: 0, y: 0, scale: 1 },
];

/**
 * ProductStoryScene narrative timeline — pin + scrub through 4 stages.
 * Last stage (470) gets a long hold so the can settles before unpinning.
 */
export function useProductStorySceneTimeline(
  refs: ProductStorySceneRefs,
  flags: ProductStorySceneFlags,
): { activeStage: number } {
  const [activeStage, setActiveStage] = useState(0);
  const { ready, prefersReducedMotion, isMobile, storyVh } = flags;

  useEffect(() => {
    if (!ready || prefersReducedMotion) return;

    const root = refs.rootRef.current;
    const pin = refs.pinRef.current;
    const can = refs.canRef.current;
    const stages = refs.stageRefs.current;
    const holdHint = refs.holdHintRef.current;
    if (!root || !pin || !can || !stages.length) return;

    const rootEl = root;
    const pinEl = pin;
    const canEl = can;
    const stageEls = stages;
    const holdHintEl = holdHint;
    const vh = storyVh;

    let dead = false;
    let revert: (() => void) | undefined;

    async function boot() {
      const { getGsap } = await import("@/lib/animation/gsap");
      const { gsap, ScrollTrigger } = getGsap();
      if (dead) return;

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: rootEl,
          start: "top top",
          end: () => `+=${vh * (window.innerHeight / 100)}`,
          pin: pinEl,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootEl,
            start: "top top",
            end: () => `+=${vh * (window.innerHeight / 100)}`,
            scrub: isMobile ? 0.5 : 0.65,
            invalidateOnRefresh: true,
          },
        });

        prepareMediaExpansion(gsap, canEl);
        gsap.set(canEl, { autoAlpha: 1, x: 0, y: 0, scale: 1, rotateX: 0 });
        gsap.set(stageEls, { autoAlpha: 0, y: isMobile ? 0 : 24 });
        if (stageEls[0]) gsap.set(stageEls[0], { autoAlpha: 1, y: 0 });
        const stage0Units = stageEls[0]?.querySelectorAll("[data-mask-unit]");
        if (stage0Units) gsap.set(stage0Units, { yPercent: 0, opacity: 1 });
        if (holdHintEl) gsap.set(holdHintEl, { autoAlpha: 0 });

        // Soft settle — never hide the can
        applyMediaExpansion(tl, canEl, {
          from: { rotateX: -6, scale: 0.96, y: 10, autoAlpha: 1 },
          to: { rotateX: 0, scale: 1, y: 0, autoAlpha: 1 },
          duration: 0.22,
          ease: "none",
          position: 0,
        });
        tl.call(() => setActiveStage(0), undefined, 0.22);

        const outY = isMobile ? 0 : -16;
        const inY = isMobile ? 0 : 20;
        let cursor = 0.55;

        for (let i = 1; i < stageEls.length; i++) {
          const isLast = i === stageEls.length - 1;
          // Extra dwell before/after the monument so 470 stays readable
          const stageSpan = isLast ? 1.55 : 1.15;
          const start = cursor;
          const prevEl = stageEls[i - 1];
          const curEl = stageEls[i];
          const curLabelUnits = curEl?.querySelectorAll("[data-mask-unit]");

          tl.to(prevEl, { autoAlpha: 0, y: outY, ease: "none", duration: 0.3 }, start);
          tl.fromTo(
            curEl,
            { autoAlpha: 0, y: inY },
            { autoAlpha: 1, y: 0, ease: "none", duration: 0.36 },
            start + 0.08,
          );
          if (curLabelUnits && curLabelUnits.length) {
            tl.fromTo(
              curLabelUnits,
              { yPercent: 110, opacity: 0 },
              { yPercent: 0, opacity: 1, ease: "none", duration: 0.4 },
              start + 0.12,
            );
          }

          if (!isMobile) {
            const target = desktopCanStates[i] ?? {};
            tl.to(canEl, { ...target, ease: "none", duration: 0.45 }, start);
          } else if (isLast) {
            // Keep can inside the clipped middle band — no shrink/drift
            tl.to(canEl, { scale: 1, x: 0, y: 0, ease: "none", duration: 0.35 }, start);
          }

          tl.call(() => setActiveStage(i), undefined, start + 0.15);
          cursor = start + stageSpan;
        }

        // Long hold on the final frame before the pin releases
        const holdStart = cursor + 0.15;
        if (holdHintEl) {
          tl.to(holdHintEl, { autoAlpha: 0.65, ease: "none", duration: 0.35 }, holdStart);
        }
        const backdropEl = pinEl.querySelector("[data-story-backdrop]");
        if (backdropEl) {
          tl.to(
            backdropEl,
            { backgroundColor: "#cfe8c4", ease: "none", duration: 0.45 },
            holdStart,
          );
        }
        tl.to({}, { duration: isMobile ? 1.1 : 0.95 }, holdStart + 0.35);
      }, rootEl);

      revert = () => {
        ctx.revert();
        ScrollTrigger.getAll()
          .filter((t) => t.trigger === rootEl)
          .forEach((t) => t.kill());
      };

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    void boot();
    return () => {
      dead = true;
      revert?.();
    };
  }, [
    ready,
    prefersReducedMotion,
    isMobile,
    storyVh,
    refs.rootRef,
    refs.pinRef,
    refs.canRef,
    refs.stageRefs,
    refs.holdHintRef,
  ]);

  return { activeStage };
}
