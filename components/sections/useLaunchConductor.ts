"use client";

import { useEffect, useState, type RefObject } from "react";
import type { MotionLayer } from "@/lib/animation/preferences";

const STORY_VH = 360;

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
 * Desktop motion for hero → product story.
 * Cans stay in document flow (no site-wide fixed stage).
 */
export function useLaunchConductor(
  refs: LaunchRefs,
  flags: LaunchFlags,
): { activeStage: number; storyVh: number } {
  const [activeStage, setActiveStage] = useState(0);
  const { ready, prefersReducedMotion, isMobile, layer } = flags;

  useEffect(() => {
    if (!ready || prefersReducedMotion || isMobile) {
      return;
    }

    const root = refs.rootRef.current;
    const hero = refs.heroRef.current;
    const story = refs.storyRef.current;
    const pin = refs.pinRef.current;
    const heroCan = refs.heroCanRef.current;
    const storyCan = refs.storyCanRef.current;
    const copy = refs.heroCopyRef.current;
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

        gsap.set(storyCanEl, { autoAlpha: 0, scale: 0.92 });

        if (layer === "fullMotion") {
          gsap.set([eyebrow, brand, ...Array.from(late)], { opacity: 0, y: 18 });
          gsap.set(lines, { yPercent: 105, opacity: 0 });
          if (court) gsap.set(court, { opacity: 0 });
          if (reflection) gsap.set(reflection, { opacity: 0 });
          gsap.set(heroCanEl, { scale: 0.92 });

          const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
          if (court) intro.to(court, { opacity: 1, duration: 0.7 }, 0);
          intro
            .to(heroCanEl, { scale: 1, duration: 0.85 }, 0.08)
            .to(reflection, { opacity: 1, duration: 0.35 }, 0.55)
            .to(brand, { opacity: 1, y: 0, duration: 0.4 }, 0.25)
            .to(eyebrow, { opacity: 1, y: 0, duration: 0.35 }, 0.45)
            .to(
              lines,
              { yPercent: 0, opacity: 1, duration: 0.55, stagger: 0.08 },
              0.55,
            )
            .to(
              late,
              { opacity: 1, y: 0, duration: 0.35, stagger: 0.05 },
              0.95,
            );
          if (sheen) {
            intro.fromTo(
              sheen,
              { x: "-130%", opacity: 0 },
              { x: "230%", opacity: 1, duration: 0.65, ease: "power2.inOut" },
              0.65,
            );
          }
        }

        let live = true;
        const qx = gsap.quickTo(heroCanEl, "x", {
          duration: 0.55,
          ease: "power3",
        });
        const qy = gsap.quickTo(heroCanEl, "y", {
          duration: 0.55,
          ease: "power3",
        });

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

        gsap.set(stages, { autoAlpha: 0, y: 24 });
        if (stages[0]) gsap.set(stages[0], { autoAlpha: 1, y: 0 });
        if (holdHint) gsap.set(holdHint, { autoAlpha: 0 });

        ScrollTrigger.create({
          trigger: storyEl,
          start: "top top",
          end: () => `+=${STORY_VH * (window.innerHeight / 100)}`,
          pin: pinEl,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootEl,
            start: "top top",
            end: () =>
              `+=${window.innerHeight + STORY_VH * (window.innerHeight / 100)}`,
            scrub: 0.65,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const heroEnd = window.innerHeight / (self.end - self.start);
              live = self.progress < heroEnd * 0.55;
              if (!live) {
                qx(0);
                qy(0);
              }
            },
          },
        });

        // Hero exit → story can enters (local elements only)
        tl.to(copyEl, { opacity: 0, y: -28, ease: "none", duration: 0.9 }, 0);
        tl.to(
          heroCanEl,
          { autoAlpha: 0, scale: 0.9, y: -40, ease: "none", duration: 0.85 },
          0.05,
        );
        tl.fromTo(
          storyCanEl,
          { autoAlpha: 0, scale: 0.94, y: 28 },
          { autoAlpha: 1, scale: 1, y: 0, ease: "none", duration: 0.9 },
          0.35,
        );
        tl.call(() => setActiveStage(0), undefined, 0.9);

        const s1 = 1.55;
        tl.to(
          stages[0],
          { autoAlpha: 0, y: -18, ease: "none", duration: 0.35 },
          s1,
        );
        tl.fromTo(
          stages[1],
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, ease: "none", duration: 0.4 },
          s1 + 0.1,
        );
        tl.to(
          storyCanEl,
          { x: 100, scale: 1, ease: "none", duration: 0.5 },
          s1,
        );
        tl.call(() => setActiveStage(1), undefined, s1 + 0.15);
        tl.to({}, { duration: 0.65 }, s1 + 0.5);

        const s2 = s1 + 1.15;
        tl.to(
          stages[1],
          { autoAlpha: 0, y: -18, ease: "none", duration: 0.35 },
          s2,
        );
        tl.fromTo(
          stages[2],
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, ease: "none", duration: 0.4 },
          s2 + 0.1,
        );
        tl.to(
          storyCanEl,
          { x: -80, scale: 1.02, ease: "none", duration: 0.5 },
          s2,
        );
        tl.call(() => setActiveStage(2), undefined, s2 + 0.15);
        tl.to({}, { duration: 0.65 }, s2 + 0.5);

        const s3 = s2 + 1.15;
        tl.to(
          stages[2],
          { autoAlpha: 0, y: -18, ease: "none", duration: 0.35 },
          s3,
        );
        tl.fromTo(
          stages[3],
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, ease: "none", duration: 0.45 },
          s3 + 0.1,
        );
        tl.to(
          storyCanEl,
          { x: 0, y: 8, scale: 1, ease: "none", duration: 0.5 },
          s3,
        );
        tl.call(() => setActiveStage(3), undefined, s3 + 0.15);
        tl.to({}, { duration: 0.7 }, s3 + 0.55);

        const hold = s3 + 1.25;
        if (holdHint) {
          tl.to(
            holdHint,
            { autoAlpha: 0.65, ease: "none", duration: 0.35 },
            hold,
          );
        }
        tl.to(
          pinEl.querySelector("[data-story-backdrop]"),
          { backgroundColor: "#cfe8c4", ease: "none", duration: 0.45 },
          hold,
        );
        tl.to({}, { duration: 0.55 }, hold + 0.25);
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

  return { activeStage, storyVh: STORY_VH };
}
