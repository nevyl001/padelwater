"use client";

import { useEffect, useRef } from "react";
import { brandStatement, communitySection } from "@/data/site-content";
import { Container } from "@/components/ui/Container";
import { CourtField } from "@/components/atmosphere/CourtField";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { distances, gsapEasings, scales } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Brand attitude — typography + court atmosphere.
 * No full can, no product specs. Fragment/crop accent only.
 */
export function EditorialParallaxScene() {
  const rootRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const { ready, prefersReducedMotion, profile } = useMotionPreferences();
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
          { y: distances.parallaxMid * strength * 0.6 },
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
          { y: 40 * strength, scale: scales.editorialTitle },
          {
            y: -30 * strength,
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
            y: -distances.parallaxFg * 1.4 * strength,
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
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <CourtField tone="dark" intensity="soft" animated={animateCourt} />
        <div className="absolute inset-0 bg-gradient-to-b from-pw-navy-deep/50 via-transparent to-pw-navy-deep/85" />
      </div>

      <div
        ref={titleRef}
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center will-change-transform"
      >
        <p
          className={cn(
            "max-w-[16ch] text-center font-display font-bold uppercase leading-[0.9]",
            "text-[clamp(2.5rem,10vw,7.5rem)] tracking-[-0.04em] text-white/[0.08]",
          )}
        >
          {brandStatement.lines[0]}
        </p>
      </div>

      <Container className="relative z-10 grid min-h-[85svh] items-center gap-12 py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.7fr)] lg:py-24">
        <div ref={midRef} className="relative will-change-transform">
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-pw-lime/80">
            En la cancha
          </p>
          <h2 className="mt-4 max-w-lg text-editorial text-pw-white">
            {communitySection.titleLines[0]}
            <br />
            {communitySection.titleLines[1]}
          </h2>
          <p className="mt-6 max-w-md text-lg text-white/65 md:text-xl">
            {communitySection.text}
          </p>
        </div>

        {/* Typographic / ball accent — not a product showcase */}
        <div
          ref={fgRef}
          className="relative flex min-h-[220px] items-center justify-center will-change-transform lg:justify-end"
        >
          <div
            aria-hidden
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(0,169,203,0.2),transparent_65%)] blur-2xl"
          />
          <p className="relative max-w-[12ch] text-right font-display text-[clamp(1.75rem,4vw,3rem)] font-bold uppercase leading-[1.05] tracking-[-0.03em] text-white/25">
            {brandStatement.lines[1]}
          </p>
          <PadelBallDecoration className="absolute -left-2 bottom-8 md:left-4" />
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
      className={cn("h-12 w-12 drop-shadow-lg md:h-14 md:w-14", className)}
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
