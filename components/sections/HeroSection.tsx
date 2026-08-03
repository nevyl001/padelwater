"use client";

import { useEffect, useRef } from "react";
import { heroContent } from "@/data/site-content";
import { ProductCan } from "@/components/product/ProductCan";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { DotPattern } from "@/components/ui/DotPattern";
import { Container } from "@/components/ui/Container";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { cn } from "@/lib/cn";

export function HeroSection() {
  const rootRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const canRef = useRef<HTMLDivElement>(null);
  const { profile, prefersReducedMotion } = useMotionPreferences();

  useEffect(() => {
    const rootEl = rootRef.current;
    const contentEl = contentRef.current;
    const canEl = canRef.current;
    if (!rootEl || !contentEl || !canEl || prefersReducedMotion) {
      contentEl?.style.setProperty("opacity", "1");
      canEl?.style.setProperty("opacity", "1");
      return;
    }

    const root = rootEl;
    const content = contentEl;
    const can = canEl;

    let cleanupPointer: (() => void) | undefined;
    let ctxRevert: (() => void) | undefined;

    async function run() {
      const { getGsap } = await import("@/lib/gsap");
      const { gsap } = getGsap();

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(
          content.querySelectorAll("[data-hero-item]"),
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, stagger: 0.1 },
        ).fromTo(
          can,
          { y: 48, scale: 0.94, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 1 },
          "-=0.55",
        );
      }, root);

      ctxRevert = () => ctx.revert();

      if (profile.enablePointerHero) {
        const onMove = (e: PointerEvent) => {
          const rect = root.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(can, {
            x: px * 18,
            y: py * 10,
            duration: 0.8,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        const onLeave = () => {
          gsap.to(can, { x: 0, y: 0, duration: 0.9, ease: "power3.out" });
        };
        root.addEventListener("pointermove", onMove);
        root.addEventListener("pointerleave", onLeave);
        cleanupPointer = () => {
          root.removeEventListener("pointermove", onMove);
          root.removeEventListener("pointerleave", onLeave);
        };
      }
    }

    void run();

    return () => {
      cleanupPointer?.();
      ctxRevert?.();
    };
  }, [prefersReducedMotion, profile.enablePointerHero]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] overflow-hidden bg-pw-navy-deep text-pw-white grain"
      aria-label="Presentación Pádel Water"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(0,169,203,0.18),transparent_55%),radial-gradient(ellipse_at_20%_80%,rgba(183,243,51,0.08),transparent_45%)]" />
      <DotPattern className="bottom-[-10%] right-[-5%] h-[42%] w-[42%] opacity-70" />

      <Container className="relative z-10 grid flex-1 items-center gap-12 py-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-24">
        <div ref={contentRef} className="max-w-xl">
          <div data-hero-item>
            <SectionLabel tone="lime">{heroContent.eyebrow}</SectionLabel>
          </div>
          <h1
            data-hero-item
            className="mt-5 text-display text-pw-white"
          >
            {heroContent.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p
            data-hero-item
            className="mt-6 max-w-md text-body-lg text-white/70"
          >
            {heroContent.description}
          </p>
          <div data-hero-item className="mt-9 flex flex-wrap gap-3">
            <Button href={heroContent.primaryHref} size="lg" magnetic>
              {heroContent.primaryCta}
            </Button>
            <Button
              href={heroContent.secondaryHref}
              variant="secondary"
              size="lg"
            >
              {heroContent.secondaryCta}
            </Button>
          </div>
        </div>

        <div
          ref={canRef}
          className={cn(
            "relative mx-auto w-full max-w-[300px] lg:max-w-[340px]",
            prefersReducedMotion ? "opacity-100" : "opacity-0",
          )}
        >
          <ProductCan priority tone="navy" className="max-w-none" />
        </div>
      </Container>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
        <a
          href="#declaracion"
          className="pointer-events-auto text-[0.65rem] uppercase tracking-[0.28em] text-white/45 transition-colors hover:text-white/80"
        >
          Scroll
        </a>
      </div>
    </section>
  );
}
