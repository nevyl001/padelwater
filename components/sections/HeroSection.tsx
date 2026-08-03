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
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, stagger: 0.08 },
        ).fromTo(
          can,
          { y: 32, scale: 0.96, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.9 },
          "-=0.45",
        );
      }, root);

      ctxRevert = () => ctx.revert();

      if (profile.enablePointerHero) {
        const onMove = (e: PointerEvent) => {
          const rect = root.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(can, {
            x: px * 12,
            y: py * 8,
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
      <DotPattern className="bottom-[-8%] right-[-4%] h-[36%] w-[36%] opacity-50" />

      <Container className="relative z-10 flex w-full flex-1 items-center py-[calc(var(--header-offset)+2.5rem)] pb-24 lg:py-[calc(var(--header-offset)+3.5rem)]">
        <div className="grid w-full items-center gap-14 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div
            ref={contentRef}
            className="mx-auto w-full max-w-lg text-center lg:mx-0 lg:max-w-xl lg:text-left"
          >
            <div data-hero-item>
              <SectionLabel tone="lime">{heroContent.eyebrow}</SectionLabel>
            </div>
            <h1
              data-hero-item
              className="mt-4 text-hero text-pw-white"
            >
              {heroContent.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p
              data-hero-item
              className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/65 md:text-lg lg:mx-0"
            >
              {heroContent.description}
            </p>
            <div
              data-hero-item
              className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start"
            >
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

          <div className="flex w-full items-center justify-center">
            <div
              ref={canRef}
              className={cn(
                "w-full max-w-[220px] sm:max-w-[240px] lg:max-w-[260px]",
                prefersReducedMotion ? "opacity-100" : "opacity-0",
              )}
            >
              <ProductCan priority tone="navy" className="max-w-none" />
            </div>
          </div>
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
