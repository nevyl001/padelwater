"use client";

import { useEffect, type RefObject } from "react";

type MobileLaunchRefs = {
  rootRef: RefObject<HTMLDivElement | null>;
  heroRef: RefObject<HTMLElement | null>;
  heroCanRef: RefObject<HTMLDivElement | null>;
  heroCopyRef: RefObject<HTMLDivElement | null>;
  mobileStoryRef: RefObject<HTMLDivElement | null>;
};

type MobileLaunchFlags = {
  ready: boolean;
  prefersReducedMotion: boolean;
  isMobile: boolean;
};

/**
 * Mobile cinematic motion — intro + per-beat scroll theatre.
 * No pin / no fixed can: vertical beats with strong entrance + scrub energy.
 */
export function useMobileLaunchMotion(
  refs: MobileLaunchRefs,
  flags: MobileLaunchFlags,
) {
  const { ready, prefersReducedMotion, isMobile } = flags;

  useEffect(() => {
    if (!ready || prefersReducedMotion || !isMobile) return;

    const root = refs.rootRef.current;
    const hero = refs.heroRef.current;
    const heroCan = refs.heroCanRef.current;
    const copy = refs.heroCopyRef.current;
    const mobileStory = refs.mobileStoryRef.current;
    if (!root || !hero || !heroCan || !copy || !mobileStory) return;

    const rootEl = root;
    const heroEl = hero;
    const heroCanEl = heroCan;
    const copyEl = copy;
    const storyEl = mobileStory;

    let dead = false;
    let revert: (() => void) | undefined;

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

        gsap.set([eyebrow, brand, ...Array.from(late)], { opacity: 0, y: 22 });
        gsap.set(lines, { yPercent: 110, opacity: 0 });
        gsap.set(heroCanEl, { opacity: 0, y: 36, scale: 0.9 });
        if (court) gsap.set(court, { opacity: 0 });
        if (reflection) gsap.set(reflection, { opacity: 0 });

        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (court) intro.to(court, { opacity: 1, duration: 0.55 }, 0);
        intro
          .to(heroCanEl, { opacity: 1, y: 0, scale: 1, duration: 0.75 }, 0.08)
          .to(reflection, { opacity: 1, duration: 0.3 }, 0.45)
          .to(brand, { opacity: 1, y: 0, duration: 0.35 }, 0.2)
          .to(eyebrow, { opacity: 1, y: 0, duration: 0.3 }, 0.35)
          .to(
            lines,
            { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.07 },
            0.4,
          )
          .to(
            late,
            { opacity: 1, y: 0, duration: 0.32, stagger: 0.05 },
            0.75,
          );
        if (sheen) {
          intro.fromTo(
            sheen,
            { x: "-120%", opacity: 0 },
            { x: "220%", opacity: 1, duration: 0.55, ease: "power2.inOut" },
            0.55,
          );
        }

        // Soft hero parallax while leaving
        gsap.to(heroCanEl, {
          y: -48,
          ease: "none",
          scrollTrigger: {
            trigger: heroEl,
            start: "top top",
            end: "bottom top",
            scrub: 0.45,
          },
        });
        gsap.to(copyEl, {
          y: -28,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: heroEl,
            start: "top top",
            end: "bottom top",
            scrub: 0.45,
          },
        });

        const beats = gsap.utils.toArray<HTMLElement>(
          storyEl.querySelectorAll("[data-mobile-beat]"),
        );

        beats.forEach((beat, index) => {
          const copyBlock = beat.querySelector("[data-beat-copy]");
          const can = beat.querySelector("[data-beat-can]");
          const mark = beat.querySelector("[data-beat-mark]");
          const courtBeat = beat.querySelector("[data-court-field]");

          if (copyBlock) {
            gsap.set(copyBlock.children, { opacity: 0, y: 28 });
          }
          if (can) gsap.set(can, { opacity: 0, y: 40, scale: 0.88 });
          if (mark) gsap.set(mark, { opacity: 0, scale: 0.9 });
          if (courtBeat) gsap.set(courtBeat, { opacity: 0.35 });

          const enter = gsap.timeline({
            scrollTrigger: {
              trigger: beat,
              start: "top 78%",
              end: "top 35%",
              toggleActions: "play none none reverse",
            },
          });

          if (courtBeat) {
            enter.to(courtBeat, { opacity: 1, duration: 0.5 }, 0);
          }
          if (mark) {
            enter.to(mark, { opacity: 0.12, scale: 1, duration: 0.55 }, 0);
          }
          if (copyBlock) {
            enter.to(
              copyBlock.children,
              {
                opacity: 1,
                y: 0,
                duration: 0.45,
                stagger: 0.07,
                ease: "power3.out",
              },
              0.08,
            );
          }
          if (can) {
            enter.to(
              can,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.65,
                ease: "power3.out",
              },
              0.18,
            );
          }

          // Continuous energy while the beat is in view
          if (can) {
            gsap.fromTo(
              can,
              { y: 18 },
              {
                y: -18,
                ease: "none",
                scrollTrigger: {
                  trigger: beat,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.55,
                },
              },
            );
          }

          if (courtBeat) {
            gsap.fromTo(
              courtBeat,
              { scale: 1.04 },
              {
                scale: 1,
                ease: "none",
                transformOrigin: "50% 80%",
                scrollTrigger: {
                  trigger: beat,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.7,
                },
              },
            );
          }

          // Alternating can / copy emphasis
          if (index % 2 === 1 && can && copyBlock) {
            gsap.fromTo(
              can,
              { x: -16 },
              {
                x: 16,
                ease: "none",
                scrollTrigger: {
                  trigger: beat,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          }
        });
      }, rootEl);

      revert = () => {
        ctx.revert();
        ScrollTrigger.getAll().forEach((t) => {
          if (
            t.trigger === rootEl ||
            t.trigger === heroEl ||
            t.trigger === storyEl ||
            (t.trigger instanceof Element && storyEl.contains(t.trigger))
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
      revert?.();
    };
  }, [
    ready,
    prefersReducedMotion,
    isMobile,
    refs.rootRef,
    refs.heroRef,
    refs.heroCanRef,
    refs.heroCopyRef,
    refs.mobileStoryRef,
  ]);
}
