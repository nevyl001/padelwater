"use client";

import { useRef } from "react";
import { heroContent, productStoryStages } from "@/data/site-content";
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
 * Mobile pin+scrub: compact centered cluster (copy → can → footer)
 * so nothing piles up and nothing floats with huge empty gaps.
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
    { ready, prefersReducedMotion, isMobile: true, layer },
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
        <Container className="relative z-10 flex flex-col items-center gap-8 px-5 pb-12 pt-[calc(var(--header-offset)+1.25rem)] text-center">
          <div ref={heroCopyRef} className="w-full max-w-md">
            <div data-hero-eyebrow>
              <SectionLabel tone="lime">{heroContent.eyebrow}</SectionLabel>
            </div>
            <h1 className="mt-4 font-display text-[clamp(2.1rem,8.5vw,2.9rem)] font-bold uppercase leading-[1.02] tracking-[-0.03em]">
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
              className="mx-auto mt-4 max-w-sm text-[0.95rem] leading-relaxed text-white/70"
            >
              {heroContent.description}
            </p>
            <div
              data-hero-late
              className="mt-7 flex flex-wrap justify-center gap-3"
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

          <div ref={heroCanRef} className="w-[180px]">
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
              "relative flex h-svh flex-col overflow-hidden pt-[var(--header-offset)]",
              toneBg[tone],
              toneText[tone],
            )}
          >
            <CourtField
              tone={courtTone[tone]}
              intensity="medium"
              animated={animateCourt}
            />

            {/* Packed under the header: tight gaps, no stretchy empty bands */}
            <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-start gap-2 px-5 pb-4 pt-3">
              <div className="relative z-20 h-[5.85rem] w-full max-w-sm shrink-0 overflow-hidden">
                {productStoryStages.map((stage, index) => (
                  <div
                    key={stage.id}
                    data-story-stage
                    className={cn(
                      "absolute inset-x-0 top-0 text-center",
                      index === 0 ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <p className="text-[0.58rem] uppercase tracking-[0.22em] opacity-55">
                      {String(index + 1).padStart(2, "0")} · {stage.eyebrow}
                    </p>
                    <h2 className="mt-1 font-display text-[clamp(1.55rem,7vw,2.15rem)] font-bold uppercase leading-[1.02] tracking-[-0.03em]">
                      {stage.label}
                    </h2>
                    {stage.layout !== "monument" ? (
                      <p className="mx-auto mt-1 line-clamp-2 max-w-[17rem] text-[0.78rem] leading-snug opacity-80">
                        {stage.text}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>

              <div
                ref={storyCanRef}
                className="w-[min(172px,46vw)] shrink-0 [&_[data-product-can-image]]:max-h-[min(52svh,380px)]"
              >
                <ProductCanStage
                  mode="inline"
                  tone={canTone}
                  size="inline"
                  quiet
                  showReflection={false}
                />
              </div>

              <div className="relative z-20 mt-1 min-h-10 w-full max-w-sm shrink-0">
                {productStoryStages.map((stage, index) =>
                  stage.layout === "monument" ? (
                    <p
                      key={`bot-${stage.id}`}
                      className={cn(
                        "text-center text-[0.8rem] leading-snug transition-opacity duration-300",
                        activeStage === index
                          ? "opacity-85"
                          : "pointer-events-none absolute inset-x-0 top-0 opacity-0",
                      )}
                    >
                      {stage.text}
                    </p>
                  ) : null,
                )}
                <p
                  data-hold-hint
                  className="mt-2 text-center text-[0.55rem] uppercase tracking-[0.28em]"
                >
                  Sigue explorando
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={cn(showPin && "hidden")}>
          {productStoryStages.map((stage) => (
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
                    <h2 className="mt-3 font-display text-3xl font-bold uppercase">
                      {stage.label}
                    </h2>
                    <p className="mt-4 opacity-80">{stage.text}</p>
                  </div>
                  <div className="w-[160px]">
                    <ProductCanStage
                      mode="inline"
                      size="inline"
                      quiet
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
