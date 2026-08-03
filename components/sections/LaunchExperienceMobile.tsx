"use client";

import { useEffect, useRef } from "react";
import { heroContent, productStoryStages } from "@/data/site-content";
import { product } from "@/data/product";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Container } from "@/components/ui/Container";
import { ProductCanStage } from "@/components/product/ProductCanStage";
import { CourtField } from "@/components/atmosphere/CourtField";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import {
  canToneFromStage,
  courtTone,
  toneBg,
  toneText,
} from "@/components/sections/launchTokens";
import { cn } from "@/lib/cn";

/**
 * Mobile-only launch: document-flow stack.
 * No pin, no absolute can overlay — copy and can never collide.
 */
export function LaunchExperienceMobile() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion, ready } = useMotionPreferences();
  const animate = ready && !prefersReducedMotion;

  useEffect(() => {
    if (!ready || prefersReducedMotion) return;
    const root = rootRef.current;
    if (!root) return;

    let revert: (() => void) | undefined;
    let dead = false;

    async function boot() {
      const { getGsap } = await import("@/lib/animation/gsap");
      const { gsap, ScrollTrigger } = getGsap();
      if (dead || !root) return;

      const ctx = gsap.context(() => {
        const hero = root.querySelector("[data-mobile-hero]");
        if (hero) {
          const parts = hero.querySelectorAll("[data-m-reveal]");
          gsap.set(parts, { opacity: 0, y: 22 });
          gsap.to(parts, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out",
            delay: 0.1,
          });
        }

        root.querySelectorAll<HTMLElement>("[data-mobile-beat]").forEach((beat) => {
          const parts = beat.querySelectorAll("[data-m-reveal]");
          gsap.set(parts, { opacity: 0, y: 26 });
          gsap.to(parts, {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: {
              trigger: beat,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          });
        });
      }, root);

      revert = () => {
        ctx.revert();
        ScrollTrigger.getAll()
          .filter((t) => t.trigger instanceof Element && root.contains(t.trigger))
          .forEach((t) => t.kill());
      };
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    void boot();
    return () => {
      dead = true;
      revert?.();
    };
  }, [ready, prefersReducedMotion]);

  return (
    <div ref={rootRef} data-launch-mobile className="relative">
      <section
        data-mobile-hero
        className="relative overflow-hidden bg-pw-navy-deep text-pw-white grain"
        aria-label="Presentación Pádel Water"
      >
        <CourtField tone="dark" intensity="medium" animated={animate} />
        <Container className="relative z-10 flex flex-col items-center gap-10 px-5 pb-14 pt-[calc(var(--header-offset)+1.25rem)] text-center">
          <div className="w-full max-w-md">
            <div data-m-reveal>
              <SectionLabel tone="lime">{heroContent.eyebrow}</SectionLabel>
            </div>
            <h1
              data-m-reveal
              className="mt-4 font-display text-[clamp(2.2rem,9vw,3.1rem)] font-bold uppercase leading-[1.02] tracking-[-0.03em]"
            >
              {heroContent.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p
              data-m-reveal
              className="mx-auto mt-5 max-w-sm text-base leading-relaxed text-white/70"
            >
              {heroContent.description}
            </p>
            <div
              data-m-reveal
              className="mt-8 flex flex-wrap justify-center gap-3"
            >
              <Button href={heroContent.primaryHref} size="lg">
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

          <div data-m-reveal className="w-full max-w-[210px]">
            <ProductCanStage mode="inline" tone="navy" size="inline" priority />
          </div>

          <a
            data-m-reveal
            href="#producto"
            className="text-[0.65rem] uppercase tracking-[0.28em] text-white/45"
          >
            Explora el producto
          </a>
        </Container>
      </section>

      <section id="producto-mobile" className="relative" aria-label="Experiencia de producto">
        {productStoryStages.map((stage, index) => (
          <div
            key={stage.id}
            data-mobile-beat
            className={cn(
              "relative overflow-hidden px-5 py-16",
              toneBg[stage.tone],
              toneText[stage.tone],
            )}
          >
            <CourtField
              tone={courtTone[stage.tone]}
              intensity="soft"
              animated={animate}
            />
            <Container className="relative z-10">
              <div className="mx-auto flex max-w-md flex-col items-center gap-9 text-center">
                <div className="w-full">
                  <p
                    data-m-reveal
                    className="text-[0.7rem] uppercase tracking-[0.28em] opacity-55"
                  >
                    {String(index + 1).padStart(2, "0")} · {stage.eyebrow}
                  </p>
                  <h2
                    data-m-reveal
                    className="mt-3 font-display text-[clamp(2.2rem,10vw,3.1rem)] font-bold uppercase leading-[1.02] tracking-[-0.03em]"
                  >
                    {stage.label}
                  </h2>
                  <p
                    data-m-reveal
                    className="mx-auto mt-4 max-w-sm text-base leading-relaxed opacity-80"
                  >
                    {stage.text}
                  </p>
                  {index === 1 ? (
                    <ul
                      data-m-reveal
                      className="mt-5 space-y-2 text-sm opacity-75"
                    >
                      <li>{product.feature}</li>
                      <li>{product.flavorLabel}</li>
                    </ul>
                  ) : null}
                </div>

                <div data-m-reveal className="w-full max-w-[200px]">
                  <ProductCanStage
                    mode="inline"
                    size="inline"
                    quiet={index === 3}
                    tone={canToneFromStage(stage.tone)}
                    showReflection={index === 3}
                  />
                </div>
              </div>
            </Container>
          </div>
        ))}
      </section>
    </div>
  );
}
