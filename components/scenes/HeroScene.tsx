"use client";

import { useRef } from "react";
import { heroContent } from "@/data/site-content";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Container } from "@/components/ui/Container";
import { CourtField } from "@/components/atmosphere/CourtField";
import { ProductCanStage } from "@/components/product/ProductCanStage";
import { ProductGlow } from "@/components/product/ProductGlow";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { ScrollIndicator } from "@/components/motion/ScrollIndicator";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { useHeroSceneTimeline } from "@/components/scenes/useHeroSceneTimeline";
import { cn } from "@/lib/cn";

/**
 * Opening scene. Fully self-contained: its own GSAP narrative timeline,
 * no shared state with ProductStoryScene. Text goes through the single
 * MaskReveal/TextReveal system; the CTA's magnetic pull is the only
 * Motion-driven piece, per the GSAP-for-narrative / Motion-for-UI split.
 */
export function HeroScene() {
  const rootRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLElement>(null);
  const descriptionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const canRef = useRef<HTMLDivElement>(null);

  const { ready, prefersReducedMotion, profile } = useMotionPreferences();

  useHeroSceneTimeline(
    { rootRef, eyebrowRef, titleRef, descriptionRef, ctaRef, canRef },
    { ready, prefersReducedMotion, enablePointerHero: profile.enablePointerHero },
  );

  const animateCourt = ready && !prefersReducedMotion;

  return (
    <section
      ref={rootRef}
      data-scene="hero"
      className="relative flex min-h-[100svh] overflow-hidden bg-pw-navy-deep text-pw-white grain"
      aria-label="Presentación Pádel Water"
    >
      <CourtField tone="dark" intensity="medium" animated={animateCourt} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_35%,rgba(0,169,203,0.18),transparent_42%),radial-gradient(ellipse_at_20%_70%,rgba(183,243,51,0.1),transparent_40%)]" />

      <Container className="relative z-10 flex w-full flex-1 items-center pb-16 pt-[calc(var(--header-offset)+2.5rem)] md:pb-20">
        <div className="grid w-full items-center gap-10 text-center md:gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:text-left xl:gap-20">
          <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-[34rem] lg:pl-4 xl:pl-8">
            <MaskReveal ref={eyebrowRef} as="div" mode="manual" splitBy="block">
              <SectionLabel tone="lime">{heroContent.eyebrow}</SectionLabel>
            </MaskReveal>

            <TextReveal
              ref={titleRef}
              variant="hero"
              mode="manual"
              lines={heroContent.titleLines}
              className="mt-5"
            />

            <TextReveal
              ref={descriptionRef}
              variant="body"
              mode="manual"
              text={heroContent.description}
              splitBy="words"
              className="mx-auto mt-6 max-w-md text-white/70 md:text-lg lg:mx-0"
            />

            <MaskReveal ref={ctaRef} as="div" mode="manual" splitBy="block" className="mt-9">
              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                <Button href={heroContent.primaryHref} size="lg" magnetic>
                  {heroContent.primaryCta}
                </Button>
                <Button href={heroContent.secondaryHref} variant="secondary" size="lg">
                  {heroContent.secondaryCta}
                </Button>
              </div>
            </MaskReveal>
          </div>

          <div className="relative flex min-h-[min(58svh,460px)] items-center justify-center">
            <ProductGlow />
            <div
              ref={canRef}
              className={cn("relative z-10", !prefersReducedMotion && "opacity-0")}
            >
              <ProductCanStage mode="inline" tone="navy" size="hero" priority />
            </div>
          </div>
        </div>
      </Container>

      <div className="absolute inset-x-0 bottom-7 z-10 flex justify-center">
        <ScrollIndicator href="#producto" />
      </div>
    </section>
  );
}
