"use client";

import { useEffect, type RefObject } from "react";

type HeroSceneRefs = {
  rootRef: RefObject<HTMLElement | null>;
  eyebrowRef: RefObject<HTMLElement | null>;
  titleRef: RefObject<HTMLElement | null>;
  descriptionRef: RefObject<HTMLElement | null>;
  ctaRef: RefObject<HTMLElement | null>;
  canRef: RefObject<HTMLDivElement | null>;
};

type HeroSceneFlags = {
  ready: boolean;
  prefersReducedMotion: boolean;
  enablePointerHero: boolean;
};

/**
 * HeroScene's own narrative timeline. Deliberately self-contained: no
 * shared gsap.context() with ProductStoryScene. The two scenes hand
 * off through scroll position only, not a shared timeline — each can
 * be rebuilt, tuned, or replaced without touching the other.
 */
export function useHeroSceneTimeline(refs: HeroSceneRefs, flags: HeroSceneFlags) {
  const { ready, prefersReducedMotion, enablePointerHero } = flags;

  useEffect(() => {
    if (!ready || prefersReducedMotion) return;

    const root = refs.rootRef.current;
    const eyebrow = refs.eyebrowRef.current;
    const title = refs.titleRef.current;
    const description = refs.descriptionRef.current;
    const cta = refs.ctaRef.current;
    const can = refs.canRef.current;
    if (!root || !eyebrow || !title || !description || !cta || !can) return;

    const rootEl = root;
    const eyebrowEl = eyebrow;
    const titleEl = title;
    const descriptionEl = description;
    const ctaEl = cta;
    const canEl = can;

    let dead = false;
    let revert: (() => void) | undefined;
    let offPointer: (() => void) | undefined;

    async function boot() {
      const { getGsap } = await import("@/lib/animation/gsap");
      const { gsap, ScrollTrigger } = getGsap();
      if (dead) return;

      const ctx = gsap.context(() => {
        const court = rootEl.querySelector("[data-court-field]");
        const reflection = canEl.querySelector("[data-product-reflection]");
        const sheen = canEl.querySelector("[data-highlight-sheen]");
        const eyebrowUnits = eyebrowEl.querySelectorAll("[data-mask-unit]");
        const titleUnits = titleEl.querySelectorAll("[data-mask-unit]");
        const descriptionUnits = descriptionEl.querySelectorAll("[data-mask-unit]");
        const ctaUnits = ctaEl.querySelectorAll("[data-mask-unit]");

        gsap.set(canEl, { opacity: 1, scale: 0.92 });
        if (reflection) gsap.set(reflection, { opacity: 0 });

        const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
        if (court) intro.fromTo(court, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0);
        intro
          .to(canEl, { scale: 1, duration: 0.8 }, 0.05)
          .to(reflection, { opacity: 1, duration: 0.3 }, 0.5)
          .fromTo(
            eyebrowUnits,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.5 },
            0.15,
          )
          .fromTo(
            titleUnits,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.65, stagger: 0.08 },
            0.28,
          )
          .fromTo(
            descriptionUnits,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.03 },
            0.55,
          )
          .fromTo(
            ctaUnits,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.5 },
            0.72,
          );

        if (sheen) {
          intro.fromTo(
            sheen,
            { x: "-130%", opacity: 0 },
            { x: "230%", opacity: 1, duration: 0.55, ease: "power2.inOut" },
            0.6,
          );
        }

        // Pointer-follow stays on the GSAP loop (not Motion) so it shares
        // one update cycle with the rest of the scene's narrative — this
        // is scene choreography, not a standalone UI micro-interaction.
        if (enablePointerHero) {
          const qx = gsap.quickTo(canEl, "x", { duration: 0.55, ease: "power3" });
          const qy = gsap.quickTo(canEl, "y", { duration: 0.55, ease: "power3" });
          const onMove = (e: PointerEvent) => {
            const rect = rootEl.getBoundingClientRect();
            if (e.clientY < rect.top || e.clientY > rect.bottom) return;
            qx(((e.clientX - rect.left) / rect.width - 0.5) * 14);
            qy(((e.clientY - rect.top) / rect.height - 0.5) * 10);
          };
          window.addEventListener("pointermove", onMove, { passive: true });
          offPointer = () => window.removeEventListener("pointermove", onMove);
        }

        // Self-contained exit: copy and can settle back as the scene
        // scrolls out. No dependency on whatever scene comes next.
        gsap.to([eyebrowEl, titleEl, descriptionEl, ctaEl], {
          opacity: 0,
          y: -20,
          ease: "none",
          scrollTrigger: {
            trigger: rootEl,
            start: "center top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(canEl, {
          opacity: 0.4,
          scale: 0.94,
          ease: "none",
          scrollTrigger: {
            trigger: rootEl,
            start: "center top",
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
    enablePointerHero,
    refs.rootRef,
    refs.eyebrowRef,
    refs.titleRef,
    refs.descriptionRef,
    refs.ctaRef,
    refs.canRef,
  ]);
}
