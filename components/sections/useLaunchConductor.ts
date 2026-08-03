"use client";

import { useEffect, useState, type RefObject } from "react";
import type { MotionLayer } from "@/lib/animation/preferences";

const STORY_VH = 360;

type LaunchRefs = {
  rootRef: RefObject<HTMLDivElement | null>;
  heroRef: RefObject<HTMLElement | null>;
  storyRef: RefObject<HTMLElement | null>;
  pinRef: RefObject<HTMLDivElement | null>;
  heroAnchorRef: RefObject<HTMLDivElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  heroCopyRef: RefObject<HTMLDivElement | null>;
};

type LaunchFlags = {
  ready: boolean;
  prefersReducedMotion: boolean;
  isMobile: boolean;
  layer: MotionLayer;
};

/**
 * Desktop conductor for hero → product story.
 * Isolated hook so Fast Refresh never remounts with a resized deps array.
 */
export function useLaunchConductor(
  refs: LaunchRefs,
  flags: LaunchFlags,
): { activeStage: number; conductorOn: boolean; storyVh: number } {
  const [activeStage, setActiveStage] = useState(0);
  const [conductorOn, setConductorOn] = useState(false);

  const { ready, prefersReducedMotion, isMobile, layer } = flags;

  useEffect(() => {
    if (!ready || prefersReducedMotion || isMobile) {
      return;
    }

    const root = refs.rootRef.current;
    const hero = refs.heroRef.current;
    const story = refs.storyRef.current;
    const pin = refs.pinRef.current;
    const anchor = refs.heroAnchorRef.current;
    const stage = refs.stageRef.current;
    const copy = refs.heroCopyRef.current;
    if (!root || !hero || !story || !pin || !anchor || !stage || !copy) return;

    const pinEl = pin;
    const stageEl = stage;
    const anchorEl = anchor;
    const copyEl = copy;
    const heroEl = hero;
    const storyEl = story;
    const rootEl = root;

    let dead = false;
    let revert: (() => void) | undefined;
    let offPointer: (() => void) | undefined;

    async function boot() {
      const { getGsap } = await import("@/lib/animation/gsap");
      const { gsap, ScrollTrigger } = getGsap();
      if (dead) return;

      const snapToAnchor = () => {
        const r = anchorEl.getBoundingClientRect();
        // Avoid parking the can at 0,0 before layout settles
        if (r.width < 8 || r.height < 8) return false;
        gsap.set(stageEl, {
          x: r.left + r.width / 2,
          y: r.top + r.height / 2,
          xPercent: -50,
          yPercent: -50,
          scale: 1,
          opacity: 1,
          force3D: true,
        });
        return true;
      };

      if (!snapToAnchor()) {
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            snapToAnchor();
            resolve();
          });
        });
      }
      if (dead) return;
      setConductorOn(true);

      const ctx = gsap.context(() => {
        const lines = copyEl.querySelectorAll("[data-hero-line]");
        const late = copyEl.querySelectorAll("[data-hero-late]");
        const eyebrow = copyEl.querySelector("[data-hero-eyebrow]");
        const brand = copyEl.querySelector("[data-hero-brand]");
        const court = heroEl.querySelector("[data-court-field]");
        const sheen = stageEl.querySelector("[data-highlight-sheen]");
        const reflection = stageEl.querySelector("[data-product-reflection]");
        const stages = gsap.utils.toArray<HTMLElement>(
          pinEl.querySelectorAll("[data-story-stage]"),
        );
        const holdHint = pinEl.querySelector("[data-hold-hint]");

        if (layer === "fullMotion") {
          gsap.set([eyebrow, brand, ...Array.from(late)], { opacity: 0, y: 18 });
          gsap.set(lines, { yPercent: 105, opacity: 0 });
          if (court) gsap.set(court, { opacity: 0 });
          if (reflection) gsap.set(reflection, { opacity: 0 });
          gsap.set(stageEl, { scale: 0.88 });

          const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
          if (court) intro.to(court, { opacity: 1, duration: 0.7 }, 0);
          intro
            .to(stageEl, { scale: 1, duration: 0.85 }, 0.08)
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
        const base = { x: 0, y: 0 };
        const qx = gsap.quickTo(stageEl, "x", {
          duration: 0.55,
          ease: "power3",
        });
        const qy = gsap.quickTo(stageEl, "y", {
          duration: 0.55,
          ease: "power3",
        });
        const refreshBase = () => {
          const r = anchorEl.getBoundingClientRect();
          base.x = r.left + r.width / 2;
          base.y = r.top + r.height / 2;
        };
        refreshBase();

        const onMove = (e: PointerEvent) => {
          if (!live) return;
          const hr = heroEl.getBoundingClientRect();
          if (e.clientY < hr.top || e.clientY > hr.bottom) return;
          const px = (e.clientX - hr.left) / hr.width - 0.5;
          const py = (e.clientY - hr.top) / hr.height - 0.5;
          qx(base.x + px * 12);
          qy(base.y + py * 9);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        offPointer = () => window.removeEventListener("pointermove", onMove);

        gsap.set(stages, { autoAlpha: 0, y: 24 });
        if (stages[0]) gsap.set(stages[0], { autoAlpha: 1, y: 0 });
        if (holdHint) gsap.set(holdHint, { autoAlpha: 0 });

        const pinCenter = () => {
          const r = pinEl.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height * 0.54 };
        };

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
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const heroEnd = window.innerHeight / (self.end - self.start);
              live = self.progress < heroEnd * 0.75;
              if (live) refreshBase();
            },
          },
        });

        tl.to(copyEl, { opacity: 0, y: -28, ease: "none", duration: 1 }, 0);
        tl.to(
          stageEl,
          {
            x: () => pinCenter().x,
            y: () => pinCenter().y,
            scale: 1.08,
            ease: "none",
            duration: 1.2,
          },
          0.12,
        );
        tl.call(() => setActiveStage(0), undefined, 1.0);

        const s1 = 1.7;
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
        // Side layout: can shifts right so copy breathes on the left
        tl.to(
          stageEl,
          {
            x: () => pinCenter().x + Math.min(160, window.innerWidth * 0.12),
            scale: 1,
            ease: "none",
            duration: 0.5,
          },
          s1,
        );
        tl.call(() => setActiveStage(1), undefined, s1 + 0.15);
        tl.to({}, { duration: 0.7 }, s1 + 0.5);

        const s2 = s1 + 1.2;
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
        // Open / coco: can drifts left, copy on the right
        tl.to(
          stageEl,
          {
            x: () => pinCenter().x - Math.min(140, window.innerWidth * 0.1),
            scale: 1.1,
            ease: "none",
            duration: 0.5,
          },
          s2,
        );
        tl.call(() => setActiveStage(2), undefined, s2 + 0.15);
        tl.to({}, { duration: 0.7 }, s2 + 0.5);

        const s3 = s2 + 1.2;
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
          stageEl,
          {
            x: () => pinCenter().x,
            y: () => pinCenter().y + 18,
            scale: 1.05,
            ease: "none",
            duration: 0.5,
          },
          s3,
        );
        tl.call(() => setActiveStage(3), undefined, s3 + 0.15);
        tl.to({}, { duration: 0.75 }, s3 + 0.55);

        const hold = s3 + 1.3;
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
        tl.to({}, { duration: 0.6 }, hold + 0.25);
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
      setConductorOn(false);
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
    refs.heroAnchorRef,
    refs.stageRef,
    refs.heroCopyRef,
  ]);

  return { activeStage, conductorOn, storyVh: STORY_VH };
}
