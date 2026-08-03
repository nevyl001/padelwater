"use client";

import { useEffect, useRef } from "react";
import { brandStatement, communitySection } from "@/data/site-content";
import { Container } from "@/components/ui/Container";
import { CourtField } from "@/components/atmosphere/CourtField";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { distances, gsapEasings, scales } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Artistic brand attitude — typography as the image on desktop;
 * clean stacked composition on mobile (no overlapping ghost type / balls).
 */
export function EditorialParallaxScene() {
  const rootRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const { ready, prefersReducedMotion, profile, isMobile } = useMotionPreferences();
  const strength = profile.parallaxStrength;

  useEffect(() => {
    if (!ready || prefersReducedMotion || strength <= 0) return;
    const root = rootRef.current;
    const bg = bgRef.current;
    const mid = midRef.current;
    const fg = fgRef.current;
    const title = titleRef.current;
    if (!root || !bg || !mid || !fg || !title) return;

    const rootEl = root;
    const bgEl = bg;
    const midEl = mid;
    const fgEl = fg;
    const titleEl = title;

    let dead = false;
    let revert: (() => void) | undefined;

    async function boot() {
      const { getGsap } = await import("@/lib/animation/gsap");
      const { gsap, ScrollTrigger } = getGsap();
      if (dead) return;

      const ctx = gsap.context(() => {
        gsap.fromTo(
          bgEl,
          { y: distances.parallaxBg * strength },
          {
            y: -distances.parallaxBg * strength,
            ease: gsapEasings.none,
            scrollTrigger: {
              trigger: rootEl,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        gsap.fromTo(
          midEl,
          { y: distances.parallaxMid * strength * 0.55 },
          {
            y: -distances.parallaxMid * strength,
            ease: gsapEasings.none,
            scrollTrigger: {
              trigger: rootEl,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        gsap.fromTo(
          titleEl,
          { y: 32 * strength, scale: scales.editorialTitle },
          {
            y: -24 * strength,
            scale: 1,
            ease: gsapEasings.none,
            scrollTrigger: {
              trigger: rootEl,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        gsap.fromTo(
          fgEl,
          { y: distances.parallaxFg },
          {
            y: -distances.parallaxFg * 1.3 * strength,
            ease: gsapEasings.none,
            scrollTrigger: {
              trigger: rootEl,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
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
  }, [ready, prefersReducedMotion, strength]);

  const animateCourt = ready && !prefersReducedMotion;

  return (
    <section
      ref={rootRef}
      data-scene="editorial-parallax"
      className="relative overflow-hidden bg-pw-navy text-pw-white"
      aria-label="Actitud de marca"
    >
      <div ref={bgRef} className="absolute inset-0">
        <CourtField
          tone="dark"
          intensity="soft"
          animated={animateCourt}
          showBalls={!isMobile}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pw-navy-deep/60 via-pw-navy/25 to-pw-navy-deep/90" />
      </div>

      {/* Ghost type — desktop only */}
      <div
        ref={titleRef}
        className="pointer-events-none absolute inset-0 z-[1] hidden items-center justify-center md:flex"
      >
        <p
          className={cn(
            "max-w-[14ch] text-center font-display font-bold uppercase leading-[0.88]",
            "text-[clamp(3rem,12vw,9rem)] tracking-[-0.045em] text-white/[0.06]",
          )}
        >
          {brandStatement.lines[0]}
        </p>
      </div>

      <Container className="relative z-10 grid min-h-0 items-center gap-10 py-16 md:min-h-[92svh] md:gap-14 md:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div ref={midRef} className="relative max-w-xl">
          <p className="text-[0.68rem] uppercase tracking-[0.32em] text-pw-lime/85">
            En la cancha
          </p>
          <h2 className="mt-4 text-editorial text-pw-white md:mt-5">
            {communitySection.titleLines[0]}
            <span className="mt-1 block text-white/90">
              {communitySection.titleLines[1]}
            </span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/72 md:mt-7 md:text-lg">
            {communitySection.text}
          </p>

          {/* Mobile brand line — readable, no overlap */}
          <p className="mt-8 max-w-[20ch] border-t border-white/15 pt-6 font-display text-lg font-bold uppercase leading-[1.15] tracking-[-0.02em] text-white/55 md:hidden">
            {brandStatement.lines[0]}{" "}
            <span className="text-white/40">{brandStatement.lines[1]}</span>
          </p>
        </div>

        <div
          ref={fgRef}
          className="relative hidden min-h-[240px] items-center justify-end md:flex"
        >
          <div
            aria-hidden
            className="absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,169,203,0.22),transparent_68%)] blur-2xl"
          />
          <div className="relative">
            <p className="max-w-[11ch] text-right font-display text-[clamp(1.35rem,2.8vw,2.15rem)] font-bold uppercase leading-[1.08] tracking-[-0.03em] text-white/30">
              {brandStatement.lines[1]}
            </p>
            <PadelBallDecoration className="absolute -right-6 top-[-1.5rem]" />
          </div>
        </div>
      </Container>
    </section>
  );
}

function PadelBallDecoration({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 64 64"
      className={cn("h-12 w-12 drop-shadow-lg", className)}
    >
      <circle cx="32" cy="32" r="28" fill="#B7F333" />
      <path
        d="M18 22c8 4 12 12 10 22M46 20c-6 8-6 18 0 26"
        fill="none"
        stroke="#071A38"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
