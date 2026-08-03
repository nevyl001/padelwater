"use client";

import { useRef } from "react";
import { heroContent } from "@/data/site-content";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Container } from "@/components/ui/Container";
import { CourtField } from "@/components/atmosphere/CourtField";
import { AuroraField } from "@/components/atmosphere/AuroraField";
import { ProductCanStage } from "@/components/product/ProductCanStage";
import { ProductGlow } from "@/components/product/ProductGlow";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { ScrollIndicator } from "@/components/motion/ScrollIndicator";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { useHeroSceneTimeline } from "@/components/scenes/useHeroSceneTimeline";
import { cn } from "@/lib/cn";

/**
 * Opening scene — cinematic entry, natural pointer depth, scroll bridge.
 * Mobile: title → can → copy/CTA (designed stack).
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
      className="relative flex min-h-[100svh] overflow-hidden bg-pw-navy-deep text-pw-white grain"
      aria-label="Presentación Pádel Water"
    >
      <AuroraField
        tone="deep"
        intensity="soft"
        animated={animateAurora}
        className="opacity-85"
      />
      <CourtField tone="dark" intensity="soft" animated={animateCourt} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_38%,rgba(0,169,203,0.16),transparent_44%),radial-gradient(ellipse_at_18%_72%,rgba(183,243,51,0.07),transparent_42%)]" />

      <div
        ref={stageRef}
        className="relative z-20 flex w-full flex-1 origin-center"
        style={{ transformOrigin: "50% 45%" }}
      >
        <Container className="relative flex w-full flex-1 items-center pb-14 pt-[calc(var(--header-offset)+0.75rem)] md:pb-24 md:pt-[calc(var(--header-offset)+2.75rem)]">
          <div className="grid w-full items-center gap-4 text-center sm:gap-7 md:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16 lg:text-left xl:gap-24">
            <div className="relative z-20 order-1 mx-auto w-full max-w-md lg:mx-0 lg:max-w-[36rem] lg:pl-2 xl:pl-6">
              <MaskReveal ref={eyebrowRef} as="div" mode="manual" splitBy="block">
                <SectionLabel tone="lime" className="tracking-[0.28em]">
                  {heroContent.eyebrow}
                </SectionLabel>
              </MaskReveal>

              <TextReveal
                ref={titleRef}
                variant="hero"
                mode="manual"
                lines={heroContent.titleLines}
                className="mt-4 md:mt-6"
              />
            </div>

            <div className="relative z-10 order-2 flex min-h-[min(30svh,240px)] items-center justify-center [perspective:1000px] sm:min-h-[min(38svh,320px)] md:min-h-[min(60svh,500px)] lg:order-2 lg:row-span-2">
              <ProductGlow className="bottom-[8%] h-28 w-[62%] opacity-90" />
              <div
                ref={canRef}
                className={cn(
                  "relative z-10 [transform-style:preserve-3d]",
                  !prefersReducedMotion && "opacity-0",
                )}
              >
                <ProductCanStage
                  mode="inline"
                  tone="navy"
                  size="hero"
                  priority
                  showPendingLabel={process.env.NODE_ENV !== "production"}
                />
              </div>
            </div>

            <div className="relative z-20 order-3 mx-auto w-full max-w-md lg:mx-0 lg:max-w-[36rem] lg:pl-2 xl:pl-6">
              <TextReveal
                ref={descriptionRef}
                variant="body"
                mode="manual"
                text={heroContent.description}
                splitBy="words"
                className="mx-auto max-w-md text-[0.95rem] leading-relaxed text-white/75 sm:text-base md:mt-1 md:text-lg md:leading-[1.55] lg:mx-0"
              />

              <MaskReveal
                ref={ctaRef}
                as="div"
                mode="manual"
                splitBy="block"
                className="mt-6 md:mt-10"
              >
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3.5 lg:justify-start">
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
              </MaskReveal>
            </div>
          </div>
        </Container>
      </div>

      <div
        ref={scrollHintRef}
        className={cn(
          "absolute inset-x-0 bottom-4 z-20 flex justify-center md:bottom-7",
          !prefersReducedMotion && "opacity-0",
        )}
      >
        <ScrollIndicator href="#producto" reinforced className="max-md:scale-90" />
      </div>
    </section>
  );
}
