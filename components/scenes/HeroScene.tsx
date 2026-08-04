"use client";

import { useRef } from "react";
import { heroContent } from "@/data/site-content";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Container } from "@/components/ui/Container";
import { CourtField } from "@/components/atmosphere/CourtField";
import { AuroraField } from "@/components/atmosphere/AuroraField";
import { BrandDiagonals } from "@/components/atmosphere/BrandDiagonals";
import { ProductCanStage } from "@/components/product/ProductCanStage";
import { ProductGlow } from "@/components/product/ProductGlow";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { ScrollIndicator } from "@/components/motion/ScrollIndicator";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { useHeroSceneTimeline } from "@/components/scenes/useHeroSceneTimeline";
import { cn } from "@/lib/cn";

/**
 * Opening scene — copy stacked left, product right. Keeps the full message
 * inside the first viewport without shearing description/CTAs at the fold.
 */
export function HeroScene() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLElement>(null);
  const descriptionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const canRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const { ready, prefersReducedMotion, profile } = useMotionPreferences();

  useHeroSceneTimeline(
    {
      rootRef,
      stageRef,
      eyebrowRef,
      titleRef,
      descriptionRef,
      ctaRef,
      canRef,
      scrollHintRef,
    },
    {
      ready,
      prefersReducedMotion,
      enablePointerHero: profile.enablePointerHero,
    },
  );

  const animateCourt = ready && !prefersReducedMotion;
  const animateAurora = ready && profile.enableAurora && !prefersReducedMotion;

  return (
    <section
      ref={rootRef}
      data-scene="hero"
      className="relative flex min-h-[100svh] overflow-x-clip bg-pw-navy-deep text-pw-white grain"
      aria-label="Presentación Pádel Water"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <AuroraField
          tone="deep"
          intensity="soft"
          animated={animateAurora}
          className="opacity-90"
        />
        <CourtField tone="dark" intensity="medium" animated={animateCourt} />
        <BrandDiagonals intensity="soft" className="opacity-55" />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_74%_42%,rgba(0,169,203,0.28),transparent_48%),radial-gradient(ellipse_at_18%_78%,rgba(191,215,69,0.12),transparent_44%)]"
        />
      </div>

      <div
        ref={stageRef}
        className="relative z-20 flex w-full flex-1 origin-center"
        style={{ transformOrigin: "50% 45%" }}
      >
        <Container className="relative flex w-full flex-1 items-center py-24 pt-[calc(var(--header-offset)+1rem)] md:py-28 md:pt-[calc(var(--header-offset)+2rem)]">
          <div className="mx-auto grid w-full max-w-[90rem] items-center gap-8 text-center sm:gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:text-left xl:gap-20">
            {/* Single copy stack — never split across can height */}
            <div className="relative z-20 order-1 mx-auto flex w-full max-w-md flex-col items-center lg:mx-0 lg:max-w-[36rem] lg:items-start">
              <MaskReveal ref={eyebrowRef} as="div" mode="manual" splitBy="block">
                <SectionLabel tone="lime">{heroContent.eyebrow}</SectionLabel>
              </MaskReveal>

              <TextReveal
                ref={titleRef}
                variant="hero"
                mode="manual"
                lines={heroContent.titleLines}
                className="mt-4 sm:mt-5 md:mt-6"
              />

              <TextReveal
                ref={descriptionRef}
                variant="body"
                mode="manual"
                text={heroContent.description}
                splitBy="words"
                className="mt-5 max-w-md text-base leading-relaxed text-white/75 sm:mt-6 sm:text-[1.05rem] md:mt-7 md:text-lg md:leading-[1.55]"
              />

              <MaskReveal
                ref={ctaRef}
                as="div"
                mode="manual"
                splitBy="block"
                className="mt-7 w-full sm:mt-8 md:mt-9"
              >
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3.5 lg:justify-start">
                  <Button href={heroContent.primaryHref} size="lg" magnetic>
                    {heroContent.primaryCta}
                  </Button>
                  <Button
                    href={heroContent.secondaryHref}
                    variant="secondary"
                    size="lg"
                    magnetic
                  >
                    {heroContent.secondaryCta}
                  </Button>
                </div>
              </MaskReveal>
            </div>

            <div className="relative z-10 order-2 mx-auto flex w-full max-w-[22rem] items-center justify-center [perspective:1100px] sm:max-w-[26rem] md:max-w-[28rem] lg:max-w-none">
              <ProductGlow className="bottom-[8%] h-32 w-[78%] opacity-95 md:h-40 md:w-[70%]" />
              <ProductGlow
                tone="lime"
                className="bottom-[20%] h-20 w-[48%] opacity-50 blur-2xl"
              />
              <div
                ref={canRef}
                className={cn(
                  "relative z-10 [transform-style:preserve-3d]",
                  !prefersReducedMotion && "opacity-0",
                )}
              >
                <ProductCanStage mode="inline" size="hero" priority />
              </div>
            </div>
          </div>
        </Container>
      </div>

      <div
        ref={scrollHintRef}
        className={cn(
          "absolute inset-x-0 bottom-4 z-20 flex justify-center md:bottom-6",
          !prefersReducedMotion && "opacity-0",
        )}
      >
        <ScrollIndicator href="#producto" reinforced className="max-md:scale-90" />
      </div>
    </section>
  );
}
