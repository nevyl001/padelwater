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
        className="opacity-90"
      />
      <CourtField tone="dark" intensity="soft" animated={animateCourt} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_40%,rgba(0,169,203,0.22),transparent_48%),radial-gradient(ellipse_at_18%_78%,rgba(183,243,51,0.08),transparent_44%)]"
      />

      <div
        ref={stageRef}
        className="relative z-20 flex w-full flex-1 origin-center"
        style={{ transformOrigin: "50% 45%" }}
      >
        <Container className="relative flex w-full flex-1 items-center pb-16 pt-[calc(var(--header-offset)+0.5rem)] sm:pb-20 md:pb-24 md:pt-[calc(var(--header-offset)+2.5rem)] xl:pb-28">
          <div className="mx-auto grid w-full max-w-[90rem] items-center gap-5 text-center sm:gap-7 md:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-16 lg:text-left xl:gap-20 2xl:gap-24">
            <div className="relative z-20 order-1 mx-auto w-full max-w-md lg:mx-0 lg:max-w-[34rem] xl:max-w-[36rem]">
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
            </div>

            <div className="relative z-10 order-2 mx-auto flex w-full max-w-[28rem] items-center justify-center [perspective:1100px] min-h-[min(36svh,280px)] sm:min-h-[min(42svh,340px)] md:min-h-[min(58svh,480px)] lg:order-2 lg:row-span-2 lg:max-w-none xl:max-w-[36rem]">
              <ProductGlow className="bottom-[7%] h-32 w-[68%] opacity-95 md:h-36 md:w-[64%]" />
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

            <div className="relative z-20 order-3 mx-auto w-full max-w-md lg:mx-0 lg:max-w-[34rem] xl:max-w-[36rem]">
              <TextReveal
                ref={descriptionRef}
                variant="body"
                mode="manual"
                text={heroContent.description}
                splitBy="words"
                className="mx-auto max-w-md text-base leading-relaxed text-white/75 sm:text-[1.05rem] md:mt-1 md:text-lg md:leading-[1.55] lg:mx-0"
              />

              <MaskReveal
                ref={ctaRef}
                as="div"
                mode="manual"
                splitBy="block"
                className="mt-7 sm:mt-8 md:mt-10"
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
          </div>
        </Container>
      </div>

      <div
        ref={scrollHintRef}
        className={cn(
          "absolute inset-x-0 bottom-5 z-20 flex justify-center md:bottom-7",
          !prefersReducedMotion && "opacity-0",
        )}
      >
        <ScrollIndicator href="#producto" reinforced className="max-md:scale-90" />
      </div>
    </section>
  );
}
