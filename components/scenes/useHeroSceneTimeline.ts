"use client";

import { useEffect, type RefObject } from "react";
import { distances, durations, gsapEasings, scales, staggers } from "@/lib/motion";

type HeroSceneRefs = {
  rootRef: RefObject<HTMLElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  eyebrowRef: RefObject<HTMLElement | null>;
  titleRef: RefObject<HTMLElement | null>;
  descriptionRef: RefObject<HTMLElement | null>;
  ctaRef: RefObject<HTMLElement | null>;
  canRef: RefObject<HTMLDivElement | null>;
  scrollHintRef: RefObject<HTMLDivElement | null>;
};

type HeroSceneFlags = {
  ready: boolean;
  prefersReducedMotion: boolean;
  enablePointerHero: boolean;
};

/**
 * Cinematic hero narrative:
 * court/aurora → title masks → product settle → copy → CTA → scroll hint.
 * Scroll bridge scales the stage slightly into the next scene.
 */
export function useHeroSceneTimeline(refs: HeroSceneRefs, flags: HeroSceneFlags) {
  const { ready, prefersReducedMotion, enablePointerHero } = flags;

  useEffect(() => {
    if (!ready || prefersReducedMotion) return;

    const root = refs.rootRef.current;
    const stage = refs.stageRef.current;
    const eyebrow = refs.eyebrowRef.current;
    const title = refs.titleRef.current;
    const description = refs.descriptionRef.current;
    const cta = refs.ctaRef.current;
    const can = refs.canRef.current;
    const scrollHint = refs.scrollHintRef.current;
    if (!root || !stage || !eyebrow || !title || !description || !cta || !can) return;

    const rootEl = root;
    const stageEl = stage;
    const eyebrowEl = eyebrow;
    const titleEl = title;
    const descriptionEl = description;
    const ctaEl = cta;
    const canEl = can;
    const scrollHintEl = scrollHint;

    let dead = false;
    let revert: (() => void) | undefined;
    let offPointer: (() => void) | undefined;

    async function boot() {
      const { getGsap } = await import("@/lib/animation/gsap");
      const { gsap, ScrollTrigger } = getGsap();
      if (dead) return;

      const ctx = gsap.context(() => {
        const court = rootEl.querySelector("[data-court-field]");
        const aurora = rootEl.querySelector("[data-aurora-field]");
        const glow = rootEl.querySelector("[data-product-glow]");
        const reflection = canEl.querySelector("[data-product-reflection]");
        const sheen = canEl.querySelector("[data-highlight-sheen]");
        const eyebrowUnits = eyebrowEl.querySelectorAll("[data-mask-unit]");
        const titleUnits = titleEl.querySelectorAll("[data-mask-unit]");
        const descriptionUnits = descriptionEl.querySelectorAll("[data-mask-unit]");
        const ctaUnits = ctaEl.querySelectorAll("[data-mask-unit]");

        gsap.set(canEl, {
          opacity: 0,
          scale: scales.heroCanEnter,
          y: 28,
          rotateX: 4,
          transformPerspective: 900,
        });
        if (reflection) gsap.set(reflection, { opacity: 0 });
        if (glow) gsap.set(glow, { opacity: 0, scale: 0.9 });
        if (aurora) gsap.set(aurora, { opacity: 0 });
        if (court) gsap.set(court, { opacity: 0 });
        if (scrollHintEl) gsap.set(scrollHintEl, { opacity: 0, y: 6 });

        const intro = gsap.timeline({ defaults: { ease: gsapEasings.outExpo } });

        if (aurora) {
          intro.to(aurora, { opacity: 1, duration: durations.heroIntro }, 0);
        }
        if (court) {
          intro.to(court, { opacity: 1, duration: durations.heroIntro }, 0.08);
        }

        intro
          .fromTo(
            eyebrowUnits,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: durations.mid },
            0.38,
          )
          .fromTo(
            titleUnits,
            { yPercent: 115, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: durations.reveal,
              stagger: staggers.lines,
            },
            0.5,
          );

        intro.to(
          canEl,
          {
            opacity: 1,
            scale: scales.heroCanRest,
            y: 0,
            rotateX: 0,
            duration: durations.heroIntro,
          },
          0.72,
        );

        if (glow) {
          intro.to(glow, { opacity: 1, scale: 1, duration: durations.slow }, 0.9);
        }
        if (reflection) {
          intro.to(reflection, { opacity: 1, duration: durations.base }, 1.1);
        }
        if (sheen) {
          intro.fromTo(
            sheen,
            { x: "-130%", opacity: 0 },
            {
              x: "230%",
              opacity: 1,
              duration: durations.sheen,
              ease: gsapEasings.inOut,
            },
            1.15,
          );
        }

        intro
          .fromTo(
            descriptionUnits,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: durations.mid,
              stagger: staggers.words,
            },
            1.2,
          )
          .fromTo(
            ctaUnits,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: durations.mid },
            1.42,
          );

        if (scrollHintEl) {
          intro.to(scrollHintEl, { opacity: 1, y: 0, duration: durations.mid }, 1.62);
        }

        if (enablePointerHero) {
          const qx = gsap.quickTo(canEl, "x", {
            duration: durations.pointer,
            ease: gsapEasings.outPower,
          });
          const qy = gsap.quickTo(canEl, "y", {
            duration: durations.pointer,
            ease: gsapEasings.outPower,
          });
          const onMove = (e: PointerEvent) => {
            const rect = rootEl.getBoundingClientRect();
            if (e.clientY < rect.top || e.clientY > rect.bottom) return;
            qx(((e.clientX - rect.left) / rect.width - 0.5) * distances.heroPointerX);
            qy(((e.clientY - rect.top) / rect.height - 0.5) * distances.heroPointerY);
          };
          window.addEventListener("pointermove", onMove, { passive: true });
          offPointer = () => window.removeEventListener("pointermove", onMove);
        }

        gsap.to(stageEl, {
          scale: scales.heroScrollOut,
          y: -distances.scrollBridgeY,
          ease: gsapEasings.none,
          scrollTrigger: {
            trigger: rootEl,
            start: "center top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to([eyebrowEl, titleEl, descriptionEl, ctaEl], {
          opacity: 0,
          y: -20,
          ease: gsapEasings.none,
          scrollTrigger: {
            trigger: rootEl,
            start: "center top",
            end: "bottom top",
            scrub: true,
          },
        });

        if (scrollHintEl) {
          gsap.to(scrollHintEl, {
            opacity: 0,
            ease: gsapEasings.none,
            scrollTrigger: {
              trigger: rootEl,
              start: "20% top",
              end: "45% top",
              scrub: true,
            },
          });
        }
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
    refs.stageRef,
    refs.eyebrowRef,
    refs.titleRef,
    refs.descriptionRef,
    refs.ctaRef,
    refs.canRef,
    refs.scrollHintRef,
  ]);
}
