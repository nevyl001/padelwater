"use client";

import { useEffect, useRef } from "react";
import { brandStatement, communitySection } from "@/data/site-content";
import { Container } from "@/components/ui/Container";
import { CourtField } from "@/components/atmosphere/CourtField";
import { BrandDiagonals } from "@/components/atmosphere/BrandDiagonals";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { distances, gsapEasings, scales } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Brand attitude. Floating balls stay in margin zones — never over copy.
 */
export function EditorialParallaxScene() {
  const rootRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const { ready, prefersReducedMotion, profile } = useMotionPreferences();
  const strength = profile.parallaxStrength;

  useEffect(() => {
    if (!ready || prefersReducedMotion || strength <= 0) return;
    const root = rootRef.current;
    const bg = bgRef.current;
    const fg = fgRef.current;
    const title = titleRef.current;
    if (!root || !bg || !fg || !title) return;

    const rootEl = root;
    const bgEl = bg;
    const fgEl = fg;
    const titleEl = title;

    let dead = false;
    let revert: (() => void) | undefined;

    async function boot() {
      const { getGsap } = await import("@/lib/animation/gsap");
      const { gsap, ScrollTrigger } = getGsap();
      if (dead) return;

      const ctx = gsap.context(() => {
        // Atmosphere only — never parallax the main copy (it was clipping
        // mid-sentence at section edges under overflow-hidden).
        gsap.fromTo(
          bgEl,
          { y: distances.parallaxBg * strength * 0.7 },
          {
            y: -distances.parallaxBg * strength * 0.7,
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
          { y: 18 * strength, scale: scales.editorialTitle },
          {
            y: -12 * strength,
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
          { y: distances.parallaxFg * 0.6 },
          {
            y: -distances.parallaxFg * 0.8 * strength,
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
  const float = !prefersReducedMotion;

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
          intensity="medium"
          animated={animateCourt}
          showBalls={false}
        />
        <BrandDiagonals intensity="soft" className="opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-pw-navy-deep/55 via-pw-navy/20 to-pw-navy-deep/90" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(0,169,203,0.2),transparent_55%),radial-gradient(ellipse_at_80%_85%,rgba(191,215,69,0.12),transparent_40%)]"
      />

      {/* Floating balls — margin zones only, behind copy */}
      <FloatingBallField animated={float} />

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

      <Container className="relative z-10 py-20 text-center md:min-h-[72svh] md:py-28 md:text-left lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16 xl:gap-20">
        <div className="relative mx-auto max-w-xl md:mx-0">
          <p className="text-[0.8rem] font-semibold uppercase tracking-[0.26em] text-pw-lime md:text-[0.88rem] md:tracking-[0.28em]">
            En la cancha
          </p>
          <h2 className="mt-4 text-editorial text-pw-white md:mt-5">
            {communitySection.titleLines[0]}
            <span className="mt-1 block text-white/90">
              {communitySection.titleLines[1]}
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/75 md:mx-0 md:mt-7 md:text-lg">
            {communitySection.text}
          </p>

          <div className="mx-auto mt-10 max-w-sm md:hidden">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <p className="mt-7 font-display text-[0.95rem] font-bold uppercase leading-[1.2] tracking-[-0.02em] text-white/60">
              {brandStatement.lines[0]}
              <span className="mt-1 block text-white/40">
                {brandStatement.lines[1]}
              </span>
            </p>
          </div>
        </div>

        <div
          ref={fgRef}
          className="relative mt-0 hidden min-h-[200px] items-center justify-end md:flex"
        >
          <div
            aria-hidden
            className="absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,169,203,0.22),transparent_68%)] blur-2xl"
          />
          <p className="relative z-[1] max-w-[11ch] text-right font-display text-[clamp(1.35rem,2.8vw,2.15rem)] font-bold uppercase leading-[1.08] tracking-[-0.03em] text-white/30">
            {brandStatement.lines[1]}
          </p>
        </div>
      </Container>
    </section>
  );
}

/** Soft float accents parked in open margins — never anchored to headlines. */
function FloatingBallField({ animated }: { animated: boolean }) {
  const balls = [
    {
      className: "left-[4%] top-[14%] h-8 w-8 max-md:left-[6%] max-md:top-[10%] max-md:h-7 max-md:w-7",
      anim: "animate-float-ball-a",
      delay: "0s",
    },
    {
      className: "right-[5%] top-[12%] h-11 w-11 max-md:right-[7%] max-md:top-[8%] max-md:h-8 max-md:w-8",
      anim: "animate-float-ball-b",
      delay: "0.8s",
    },
    {
      className: "left-[7%] bottom-[12%] h-9 w-9 max-md:left-[8%] max-md:bottom-[10%] max-md:h-7 max-md:w-7",
      anim: "animate-float-ball-c",
      delay: "1.4s",
    },
    {
      className: "right-[8%] bottom-[14%] h-7 w-7 max-md:right-[10%] max-md:bottom-[8%] max-md:h-6 max-md:w-6",
      anim: "animate-float-ball-a",
      delay: "2.1s",
    },
    {
      className: "left-[22%] top-[8%] h-5 w-5 opacity-75 max-md:hidden",
      anim: "animate-float-ball-b",
      delay: "1.1s",
    },
  ] as const;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      {balls.map((ball, i) => (
        <span
          key={i}
          className={cn("absolute drop-shadow-lg", ball.className, animated && ball.anim)}
          style={animated ? { animationDelay: ball.delay } : undefined}
        >
          <PadelBallDecoration className="h-full w-full" />
        </span>
      ))}
    </div>
  );
}

function PadelBallDecoration({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 64 64"
      className={cn("h-12 w-12", className)}
    >
      <circle cx="32" cy="32" r="28" fill="#BFD745" />
      <path
        d="M18 22c8 4 12 12 10 22M46 20c-6 8-6 18 0 26"
        fill="none"
        stroke="#1F2754"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
