"use client";

import { useEffect, useRef } from "react";
import { brandStatement, communitySection } from "@/data/site-content";
import { Container } from "@/components/ui/Container";
import { CourtField } from "@/components/atmosphere/CourtField";
import { BrandDiagonals } from "@/components/atmosphere/BrandDiagonals";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { distances, gsapEasings } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Brand attitude. Floating balls stay in margin zones — never over copy.
 * Overflow is clipped only on decorative layers so oblique type and the
 * handoff into Flavor stay clean.
 */
export function EditorialParallaxScene() {
  const rootRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const { ready, prefersReducedMotion, profile } = useMotionPreferences();
  const strength = profile.parallaxStrength;

  useEffect(() => {
    if (!ready || prefersReducedMotion || strength <= 0) return;
    const root = rootRef.current;
    const bg = bgRef.current;
    if (!root || !bg) return;

    const rootEl = root;
    const bgEl = bg;

    let dead = false;
    let revert: (() => void) | undefined;

    async function boot() {
      const { getGsap } = await import("@/lib/animation/gsap");
      const { gsap, ScrollTrigger } = getGsap();
      if (dead) return;

      const ctx = gsap.context(() => {
        gsap.fromTo(
          bgEl,
          { y: distances.parallaxBg * strength * 0.45 },
          {
            y: -distances.parallaxBg * strength * 0.45,
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
      className="relative bg-pw-navy text-pw-white"
      aria-label="Actitud de marca"
    >
      {/* Decor only — clip here so section edges don't shear copy */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div ref={bgRef} className="absolute inset-0">
          <CourtField
            tone="dark"
            intensity="medium"
            animated={animateCourt}
            showBalls={false}
          />
          <BrandDiagonals intensity="soft" className="opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-pw-navy-deep/55 via-pw-navy/20 to-pw-navy" />
        </div>

        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(0,169,203,0.2),transparent_55%),radial-gradient(ellipse_at_80%_85%,rgba(191,215,69,0.1),transparent_40%)]"
        />

        <FloatingBallField animated={float} />

        {/* Ghost line — masked so it never hard-cuts at the bottom seam */}
        <div
          aria-hidden
          className="absolute inset-0 z-[1] hidden items-center justify-center md:flex [mask-image:linear-gradient(180deg,transparent_0%,black_18%,black_72%,transparent_100%)]"
        >
          <p
            className={cn(
              "max-w-[12ch] text-center font-display font-bold uppercase leading-[0.88]",
              "text-[clamp(2.5rem,9vw,7rem)] tracking-[-0.045em] text-white/[0.05]",
            )}
          >
            {brandStatement.lines[0]}
          </p>
        </div>
      </div>

      <Container className="relative z-10 py-24 text-center md:py-32 md:text-left lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16 xl:gap-20">
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

        <div className="relative mt-0 hidden items-center justify-end md:flex">
          <div
            aria-hidden
            className="absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,169,203,0.22),transparent_68%)] blur-2xl"
          />
          <p className="relative z-[1] max-w-[11ch] text-right font-display text-[clamp(1.2rem,2.4vw,1.85rem)] font-bold uppercase leading-[1.12] tracking-[-0.03em] text-white/28">
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
      className:
        "left-[4%] top-[18%] h-8 w-8 max-md:left-[6%] max-md:top-[12%] max-md:h-7 max-md:w-7",
      anim: "animate-float-ball-a",
      delay: "0s",
    },
    {
      className:
        "right-[5%] top-[16%] h-11 w-11 max-md:right-[7%] max-md:top-[10%] max-md:h-8 max-md:w-8",
      anim: "animate-float-ball-b",
      delay: "0.8s",
    },
    {
      className:
        "left-[7%] bottom-[18%] h-9 w-9 max-md:left-[8%] max-md:bottom-[14%] max-md:h-7 max-md:w-7",
      anim: "animate-float-ball-c",
      delay: "1.4s",
    },
    {
      className:
        "right-[8%] bottom-[20%] h-7 w-7 max-md:right-[10%] max-md:bottom-[12%] max-md:h-6 max-md:w-6",
      anim: "animate-float-ball-a",
      delay: "2.1s",
    },
    {
      className: "left-[22%] top-[12%] h-5 w-5 opacity-75 max-md:hidden",
      anim: "animate-float-ball-b",
      delay: "1.1s",
    },
  ] as const;

  return (
    <div aria-hidden className="absolute inset-0 z-[2]">
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
    <svg aria-hidden viewBox="0 0 64 64" className={cn("h-12 w-12", className)}>
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
