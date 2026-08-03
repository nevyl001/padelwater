"use client";

import { useRef } from "react";
import { heroContent, productStoryStages } from "@/data/site-content";
import { product } from "@/data/product";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Container } from "@/components/ui/Container";
import { ProductCanStage } from "@/components/product/ProductCanStage";
import { CourtField } from "@/components/atmosphere/CourtField";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { useLaunchConductor } from "@/components/sections/useLaunchConductor";
import {
  canToneFromStage,
  courtTone,
  toneBg,
  toneText,
} from "@/components/sections/launchTokens";
import { cn } from "@/lib/cn";

/**
 * Mobile launch WITH pin+scrub theatre.
 * Strict bands so copy (top) and can (middle) never collide.
 */
export function LaunchExperienceMobile() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const heroCanRef = useRef<HTMLDivElement>(null);
  const storyCanRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);

  const { prefersReducedMotion, ready, layer } = useMotionPreferences();

  const { activeStage, storyVh } = useLaunchConductor(
    {
      rootRef,
      heroRef,
      storyRef,
      pinRef,
      heroCanRef,
      storyCanRef,
      heroCopyRef,
    },
    {
      ready,
      prefersReducedMotion,
      isMobile: true,
      layer,
    },
  );

  const showPin = !prefersReducedMotion;
  const animateCourt = ready && !prefersReducedMotion;
  const tone = productStoryStages[activeStage]?.tone ?? "navy";
  const canTone = canToneFromStage(tone);

  return (
    <div ref={rootRef} data-launch-mobile className="relative">
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-pw-navy-deep text-pw-white grain"
        aria-label="Presentación Pádel Water"
      >
        <CourtField tone="dark" intensity="medium" animated={animateCourt} />
        <Container className="relative z-10 flex flex-col items-center gap-9 px-5 pb-14 pt-[calc(var(--header-offset)+1.25rem)] text-center">
          <div ref={heroCopyRef} className="w-full max-w-md">
            <div data-hero-eyebrow>
              <SectionLabel tone="lime">{heroContent.eyebrow}</SectionLabel>
            </div>
            <h1 className="mt-4 font-display text-[clamp(2.2rem,9vw,3.1rem)] font-bold uppercase leading-[1.02] tracking-[-0.03em]">
              {heroContent.titleLines.map((line) => (
                <span key={line} className="block overflow-hidden">
                  <span data-hero-line className="block">
                    {line}
                  </span>
                </span>
              ))}
            </h1>
            <p
              data-hero-late
              className="mx-auto mt-5 max-w-sm text-base leading-relaxed text-white/70"
            >
              {heroContent.description}
            </p>
            <div
              data-hero-late
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

          <div ref={heroCanRef} className="w-full max-w-[200px]">
            <ProductCanStage mode="inline" tone="navy" size="inline" priority />
          </div>

          <a
            href="#producto"
            className="text-[0.65rem] uppercase tracking-[0.28em] text-white/45"
          >
            Explora el producto
          </a>
        </Container>
      </section>

      <section
        ref={storyRef}
        className="relative"
        aria-label="Experiencia de producto"
        style={showPin ? { height: `${storyVh}vh` } : undefined}
      >
        <div ref={pinRef} className={cn("relative", !showPin && "hidden")}>
          <div
            data-story-backdrop
            className={cn(
              "relative h-svh overflow-hidden pt-[var(--header-offset)]",
              toneBg[tone],
              toneText[tone],
            )}
          >
            <CourtField
              tone={courtTone[tone]}
              intensity="medium"
              animated={animateCourt}
            />

            {/* CAN BAND — fixed middle slot, never enters the text band */}
            <div className="pointer-events-none absolute inset-x-0 top-[48%] z-[5] flex -translate-y-1/2 justify-center">
              <div
                ref={storyCanRef}
                className={cn(activeStage === 3 && "scale-[0.9]")}
              >
                <div className="w-[min(42vw,170px)]">
                  <ProductCanStage
                    mode="inline"
                    tone={canTone}
                    size="inline"
                    quiet
                    showReflection
                  />
                </div>
              </div>
            </div>

            {/* TEXT BAND — top only */}
            <div className="relative z-20 h-full">
              {productStoryStages.map((stage, index) => (
                <div
                  key={stage.id}
                  data-story-stage
                  className={cn(
                    "absolute inset-x-5",
                    stage.layout === "monument"
                      ? "top-[6%] bottom-[8%] flex flex-col"
                      : "top-[6%] max-h-[34%] overflow-hidden",
                    index === 0 ? "opacity-100" : "opacity-0",
                  )}
                >
                  <div className="mx-auto w-full max-w-sm shrink-0 text-center">
                    <p className="text-[0.65rem] uppercase tracking-[0.24em] opacity-55">
                      {String(index + 1).padStart(2, "0")} · {stage.eyebrow}
                    </p>
                    <h2 className="mt-2 font-display text-[clamp(1.85rem,8vw,2.6rem)] font-bold uppercase leading-[1.02] tracking-[-0.03em]">
                      {stage.label}
                    </h2>
                    {stage.layout !== "monument" ? (
                      <>
                        <p className="mx-auto mt-2 max-w-[18rem] text-[0.9rem] leading-snug opacity-80">
                          {stage.text}
                        </p>
                        {stage.layout === "side" ? (
                          <ul className="mt-3 space-y-1.5 text-[0.75rem] opacity-70">
                            <li>{product.feature}</li>
                            <li>{product.flavorLabel}</li>
                          </ul>
                        ) : null}
                      </>
                    ) : null}
                  </div>

                  {stage.layout === "monument" ? (
                    <>
                      <div aria-hidden className="min-h-[38svh] flex-1" />
                      <p className="mx-auto max-w-[18rem] shrink-0 text-center text-[0.9rem] leading-snug opacity-85">
                        {stage.text}
                      </p>
                    </>
                  ) : null}
                </div>
              ))}

              <p
                data-hold-hint
                className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2 text-[0.6rem] uppercase tracking-[0.28em]"
              >
                Sigue explorando
              </p>
            </div>
          </div>
        </div>

        {/* Reduced-motion fallback */}
        <div className={cn(showPin && "hidden")}>
          {productStoryStages.map((stage, index) => (
            <div
              key={stage.id}
              className={cn(
                "relative overflow-hidden px-5 py-14",
                toneBg[stage.tone],
                toneText[stage.tone],
              )}
            >
              <Container className="relative z-10">
                <div className="mx-auto flex max-w-md flex-col items-center gap-8 text-center">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] opacity-55">
                      {stage.eyebrow}
                    </p>
                    <h2 className="mt-3 font-display text-[clamp(2rem,9vw,2.8rem)] font-bold uppercase">
                      {stage.label}
                    </h2>
                    <p className="mt-4 text-base opacity-80">{stage.text}</p>
                  </div>
                  <div className="w-[170px]">
                    <ProductCanStage
                      mode="inline"
                      size="inline"
                      quiet={index === 3}
                      tone={canToneFromStage(stage.tone)}
                    />
                  </div>
                </div>
              </Container>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
