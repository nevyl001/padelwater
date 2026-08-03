"use client";

import { useEffect, type RefObject } from "react";

type CourtSceneRefs = {
  rootRef: RefObject<HTMLElement | null>;
  trackRef: RefObject<HTMLDivElement | null>;
  mobileStackRef: RefObject<HTMLDivElement | null>;
};

type CourtSceneFlags = {
  ready: boolean;
  prefersReducedMotion: boolean;
  isMobile: boolean;
};

/**
 * Desktop: horizontal pin+scrub track — the physical slide IS the
 * reveal, no separate fade needed. Mobile: per-card vertical reveal,
 * where the label routes through the shared MaskReveal system
 * (queried via [data-mask-unit] like every other scene) instead of a
 * one-off fade.
 */
export function useCourtSceneTimeline(refs: CourtSceneRefs, flags: CourtSceneFlags) {
  const { ready, prefersReducedMotion, isMobile } = flags;

  useEffect(() => {
    const rootEl = refs.rootRef.current;
    if (!ready || !rootEl || prefersReducedMotion) return;

    let dead = false;
    let revert: (() => void) | undefined;

    async function boot() {
      const { getGsap } = await import("@/lib/animation/gsap");
      const { gsap, ScrollTrigger } = getGsap();
      if (dead) return;
      const root = rootEl!;

      const ctx = gsap.context(() => {
        if (!isMobile && refs.trackRef.current) {
          const track = refs.trackRef.current;
          const totalScroll = () => Math.max(0, track.scrollWidth - window.innerWidth);

          gsap.to(track, {
            x: () => -totalScroll(),
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: () => `+=${Math.max(totalScroll(), window.innerHeight * 0.85)}`,
              pin: true,
              scrub: 0.65,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        }

        if (isMobile && refs.mobileStackRef.current) {
          const cards = gsap.utils.toArray<HTMLElement>(
            refs.mobileStackRef.current.querySelectorAll("[data-moment-card]"),
          );
          cards.forEach((card) => {
            const court = card.querySelector("[data-court-field]");
            const eyebrow = card.querySelector("[data-moment-eyebrow]");
            const labelUnits = card.querySelectorAll("[data-mask-unit]");
            const text = card.querySelector("[data-moment-text]");

            if (court) gsap.set(court, { opacity: 0.4 });
            if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 26 });
            if (text) gsap.set(text, { opacity: 0, y: 26 });

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            });
            if (court) tl.to(court, { opacity: 1, duration: 0.45 }, 0);
            if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.4 }, 0.05);
            if (labelUnits.length) {
              tl.fromTo(
                labelUnits,
                { yPercent: 110, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.45, stagger: 0.05 },
                0.1,
              );
            }
            if (text) {
              tl.to(text, { opacity: 1, y: 0, duration: 0.42, ease: "power3.out" }, 0.18);
            }
          });
        }
      }, root);

      revert = () => {
        ctx.revert();
        ScrollTrigger.getAll()
          .filter((t) => t.trigger === root || (t.trigger instanceof Element && root.contains(t.trigger)))
          .forEach((t) => t.kill());
      };
    }

    void boot();
    return () => {
      dead = true;
      revert?.();
    };
  }, [ready, prefersReducedMotion, isMobile, refs.rootRef, refs.trackRef, refs.mobileStackRef]);
}
