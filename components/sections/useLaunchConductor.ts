"use client";

import { useEffect, useState, type RefObject } from "react";
import type { MotionLayer } from "@/lib/animation/preferences";

const STORY_VH_DESKTOP = 360;
const STORY_VH_MOBILE = 300;

type LaunchRefs = {
  rootRef: RefObject<HTMLDivElement | null>;
  heroRef: RefObject<HTMLElement | null>;
  storyRef: RefObject<HTMLElement | null>;
  pinRef: RefObject<HTMLDivElement | null>;
  heroCanRef: RefObject<HTMLDivElement | null>;
  storyCanRef: RefObject<HTMLDivElement | null>;
  heroCopyRef: RefObject<HTMLDivElement | null>;
};

type LaunchFlags = {
  ready: boolean;
  prefersReducedMotion: boolean;
  isMobile: boolean;
  layer: MotionLayer;
};

/**
 * Shared scroll theatre for hero → product story (desktop + mobile).
 * Pin + scrub stages; can stays inside the pin (never site-fixed).
 */
export function useLaunchConductor(
  refs: LaunchRefs,
  flags: LaunchFlags,
): { activeStage: number; storyVh: number } {
  const [activeStage, setActiveStage] = useState(0);
  const { ready, prefersReducedMotion, isMobile, layer } = flags;
  const storyVh = isMobile ? STORY_VH_MOBILE : STORY_VH_DESKTOP;

  useEffect(() => {
    if (!ready || prefersReducedMotion) return;

    const root = refs.rootRef?.current;
    const hero = refs.heroRef?.current;
    const story = refs.storyRef?.current;
    const pin = refs.pinRef?.current;
    const heroCan = refs.heroCanRef?.current;
    const storyCan = refs.storyCanRef?.current;
    const copy = refs.heroCopyRef?.current;
    if (!root || !hero || !story || !pin || !heroCan || !storyCan || !copy) {
      return;
    }

    const rootEl = root;
    const heroEl = hero;
    const storyEl = story;
    const pinEl = pin;
    const heroCanEl = heroCan;
    const storyCanEl = storyCan;
    const copyEl = copy;
    const vh = isMobile ? STORY_VH_MOBILE : STORY_VH_DESKTOP;
    // No lateral can shift on phones — it collides with centered copy
    const shift = isMobile ? 0 : 100;

    let dead = false;
    let revert: (() => void) | undefined;
    let offPointer: (() => void) | undefined;

    async function boot() {
      const { getGsap } = await import("@/lib/animation/gsap");
      const { gsap, ScrollTrigger } = getGsap();
      if (dead) return;

      const ctx = gsap.context(() => {
        const lines = copyEl.querySelectorAll("[data-hero-line]");
        const late = copyEl.querySelectorAll("[data-hero-late]");
        const eyebrow = copyEl.querySelector("[data-hero-eyebrow]");
        const brand = copyEl.querySelector("[data-hero-brand]");
        const court = heroEl.querySelector("[data-court-field]");
        const sheen = heroCanEl.querySelector("[data-highlight-sheen]");
        const reflection = heroCanEl.querySelector("[data-product-reflection]");
        const stages = gsap.utils.toArray<HTMLElement>(
          pinEl.querySelectorAll("[data-story-stage]"),
        );
        const holdHint = pinEl.querySelector("[data-hold-hint]");

        gsap.set(storyCanEl, { autoAlpha: 0, scale: 0.92, x: 0, y: 0 });

        // Intro on both desktop and mobile
        gsap.set([eyebrow, brand, ...Array.from(late)], { opacity: 0, y: 18 });
        gsap.set(lines, { yPercent: 105, opacity: 0 });
        if (court) gsap.set(court, { opacity: 0 });
        if (reflection) gsap.set(reflection, { opacity: 0 });
        gsap.set(heroCanEl, { scale: 0.92, opacity: 1 });

        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (court) intro.to(court, { opacity: 1, duration: 0.55 }, 0);
        intro
          .to(heroCanEl, { scale: 1, duration: 0.75 }, 0.06)
          .to(reflection, { opacity: 1, duration: 0.3 }, 0.45)
          .to(brand, { opacity: 1, y: 0, duration: 0.35 }, 0.18)
          .to(eyebrow, { opacity: 1, y: 0, duration: 0.3 }, 0.32)
          .to(
            lines,
            { yPercent: 0, opacity: 1, duration: 0.48, stagger: 0.07 },
            0.38,
          )
          .to(
            late,
            { opacity: 1, y: 0, duration: 0.32, stagger: 0.05 },
            0.78,
          );
        if (sheen) {
          intro.fromTo(
            sheen,
            { x: "-130%", opacity: 0 },
            { x: "230%", opacity: 1, duration: 0.55, ease: "power2.inOut" },
            0.55,
          );
        }

        let live = !isMobile;
        const qx = gsap.quickTo(heroCanEl, "x", {
          duration: 0.55,
          ease: "power3",
        });
        const qy = gsap.quickTo(heroCanEl, "y", {
          duration: 0.55,
          ease: "power3",
        });

        if (!isMobile) {
          const onMove = (e: PointerEvent) => {
            if (!live) return;
            const hr = heroEl.getBoundingClientRect();
            if (e.clientY < hr.top || e.clientY > hr.bottom) return;
            const px = (e.clientX - hr.left) / hr.width - 0.5;
            const py = (e.clientY - hr.top) / hr.height - 0.5;
            qx(px * 14);
            qy(py * 10);
          };
          window.addEventListener("pointermove", onMove, { passive: true });
          offPointer = () => window.removeEventListener("pointermove", onMove);
        }

        gsap.set(stages, { autoAlpha: 0, y: 24 });
        if (stages[0]) gsap.set(stages[0], { autoAlpha: 1, y: 0 });
        if (holdHint) gsap.set(holdHint, { autoAlpha: 0 });

        ScrollTrigger.create({
          trigger: storyEl,
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
            end: () =>
              `+=${window.innerHeight + vh * (window.innerHeight / 100)}`,
            scrub: isMobile ? 0.45 : 0.65,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (isMobile) return;
              const heroEnd = window.innerHeight / (self.end - self.start);
              live = self.progress < heroEnd * 0.55;
              if (!live) {
                qx(0);
                qy(0);
              }
            },
          },
        });

        tl.to(copyEl, { opacity: 0, y: -24, ease: "none", duration: 0.85 }, 0);
        tl.to(
          heroCanEl,
          { autoAlpha: 0, scale: 0.9, y: -32, ease: "none", duration: 0.8 },
          0.05,
        );
        tl.fromTo(
          storyCanEl,
          { autoAlpha: 0, scale: 0.94, y: 24 },
          { autoAlpha: 1, scale: 1, y: 0, ease: "none", duration: 0.85 },
          0.3,
        );
        tl.call(() => setActiveStage(0), undefined, 0.85);

        const s1 = 1.45;
        tl.to(
          stages[0],
          { autoAlpha: 0, y: -16, ease: "none", duration: 0.32 },
          s1,
        );
        tl.fromTo(
          stages[1],
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, ease: "none", duration: 0.38 },
          s1 + 0.08,
        );
        tl.to(
          storyCanEl,
          { x: shift, scale: 1, ease: "none", duration: 0.45 },
          s1,
        );
        tl.call(() => setActiveStage(1), undefined, s1 + 0.12);
        tl.to({}, { duration: 0.6 }, s1 + 0.45);

        const s2 = s1 + 1.05;
        tl.to(
          stages[1],
          { autoAlpha: 0, y: -16, ease: "none", duration: 0.32 },
          s2,
        );
        tl.fromTo(
          stages[2],
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, ease: "none", duration: 0.38 },
          s2 + 0.08,
        );
        tl.to(
          storyCanEl,
          { x: -shift * 0.75, scale: 1.02, ease: "none", duration: 0.45 },
          s2,
        );
        tl.call(() => setActiveStage(2), undefined, s2 + 0.12);
        tl.to({}, { duration: 0.6 }, s2 + 0.45);

        const s3 = s2 + 1.05;
        tl.to(
          stages[2],
          { autoAlpha: 0, y: -16, ease: "none", duration: 0.32 },
          s3,
        );
        tl.fromTo(
          stages[3],
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, ease: "none", duration: 0.42 },
          s3 + 0.08,
        );
        tl.to(
          storyCanEl,
          {
            x: 0,
            y: isMobile ? 0 : 36,
            scale: isMobile ? 0.9 : 0.92,
            ease: "none",
            duration: 0.45,
          },
          s3,
        );
        tl.call(() => setActiveStage(3), undefined, s3 + 0.12);
        tl.to({}, { duration: 0.65 }, s3 + 0.5);

        const hold = s3 + 1.15;
        if (holdHint) {
          tl.to(
            holdHint,
            { autoAlpha: 0.65, ease: "none", duration: 0.3 },
            hold,
          );
        }
        tl.to(
          pinEl.querySelector("[data-story-backdrop]"),
          { backgroundColor: "#cfe8c4", ease: "none", duration: 0.4 },
          hold,
        );
        tl.to({}, { duration: 0.5 }, hold + 0.2);
      }, rootEl);

      revert = () => {
        ctx.revert();
        ScrollTrigger.getAll().forEach((t) => {
          if (
            t.trigger === rootEl ||
            t.trigger === storyEl ||
            t.trigger === heroEl
          ) {
            t.kill();
          }
        });
      };

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    void boot();
    return () => {
      dead = true;
      offPointer?.();
      revert?.();
    };
  }, [
    ready,
    prefersReducedMotion,
    isMobile,
    layer,
    refs.rootRef,
    refs.heroRef,
    refs.storyRef,
    refs.pinRef,
    refs.heroCanRef,
    refs.storyCanRef,
    refs.heroCopyRef,
  ]);

  return { activeStage, storyVh };
}
