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

function stageShellClass(layout: (typeof productStoryStages)[number]["layout"]) {
  switch (layout) {
    case "monument":
      return "inset-0 flex flex-col justify-between px-[max(2rem,8%)] pb-24 pt-6 text-center";
    case "backdrop":
      return "left-[max(2.5rem,calc((100vw-min(100vw,85rem))/2+1.5rem))] top-[18%] w-[min(26rem,34vw)] text-left";
    case "side":
      return "left-[max(2.5rem,calc((100vw-min(100vw,85rem))/2+1.5rem))] top-[16%] w-[min(22rem,28vw)] text-left";
    case "open":
      return "right-[max(2.5rem,calc((100vw-min(100vw,85rem))/2+1.5rem))] top-[18%] w-[min(22rem,28vw)] text-right";
    default:
      return "left-1/2 top-1/2 w-[min(28rem,88%)] -translate-x-1/2 -translate-y-1/2 text-center";
  }
}

/**
 * Desktop-only launch: pinned scrub theatre with one story can in the pin.
 */
export function LaunchExperienceDesktop() {
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
      isMobile: false,
      layer,
    },
  );

  const showPin = !prefersReducedMotion;
  const animateCourt = ready && !prefersReducedMotion;
  const tone = productStoryStages[activeStage]?.tone ?? "navy";
  const canTone = canToneFromStage(tone);

  return (
    <div ref={rootRef} data-launch-desktop className="relative">
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] overflow-hidden bg-pw-navy-deep text-pw-white grain"
        aria-label="Presentación Pádel Water"
      >
        <CourtField tone="dark" intensity="medium" animated={animateCourt} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_35%,rgba(0,169,203,0.18),transparent_42%),radial-gradient(ellipse_at_20%_70%,rgba(183,243,51,0.1),transparent_40%)]" />

        <Container className="relative z-10 flex w-full flex-1 items-center pb-20 pt-[calc(var(--header-offset)+2.5rem)]">
          <div className="grid w-full items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] xl:gap-20">
            <div
              ref={heroCopyRef}
              className="w-full max-w-[34rem] justify-self-start pl-4 text-left xl:pl-8"
            >
              <div data-hero-eyebrow>
                <SectionLabel tone="lime">{heroContent.eyebrow}</SectionLabel>
              </div>
              <h1 className="mt-5 font-display text-[clamp(2.35rem,5vw,4rem)] font-bold uppercase leading-[0.98] tracking-[-0.03em]">
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
                className="mt-6 max-w-md text-base leading-relaxed text-white/70 md:text-lg"
              >
                {heroContent.description}
              </p>
              <div data-hero-late className="mt-9 flex flex-wrap gap-3">
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

            <div className="relative flex min-h-[min(68svh,500px)] items-center justify-center">
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-[10%] left-1/2 h-24 w-[55%] -translate-x-1/2 rounded-[100%] bg-pw-cyan/25 blur-3xl"
              />
              <div ref={heroCanRef} className="relative z-10">
                <ProductCanStage
                  mode="inline"
                  tone="navy"
                  size="hero"
                  priority
                />
              </div>
            </div>
          </div>
        </Container>

        <div className="absolute inset-x-0 bottom-7 z-10 flex justify-center">
          <a
            href="#producto"
            className="text-[0.65rem] uppercase tracking-[0.28em] text-white/45 transition-colors hover:text-white/80"
          >
            Explora el producto
          </a>
        </div>
      </section>

      <section
        ref={storyRef}
        id="producto-desktop"
        className="relative anchor-offset"
        aria-label="Experiencia de producto"
        style={showPin ? { height: `${storyVh}vh` } : undefined}
      >
        <div ref={pinRef} className={cn("relative", !showPin && "hidden")}>
          <div
            data-story-backdrop
            className={cn(
              "relative h-svh overflow-hidden pt-[var(--header-offset)] transition-colors duration-500",
              toneBg[tone],
              toneText[tone],
            )}
          >
            <CourtField
              tone={courtTone[tone]}
              intensity="medium"
              animated={animateCourt}
            />

            <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center pt-[calc(var(--header-offset)*0.35)]">
              <div
                ref={storyCanRef}
                className={cn(activeStage === 3 && "scale-[0.8]")}
              >
                <ProductCanStage
                  mode="inline"
                  tone={canTone}
                  size="story"
                  quiet
                  showReflection
                />
              </div>
            </div>

            <div className="relative z-20 h-full">
              {productStoryStages.map((stage, index) => (
                <div
                  key={stage.id}
                  data-story-stage
                  className={cn(
                    "absolute",
                    stageShellClass(stage.layout),
                    index === 0 ? "opacity-100" : "opacity-0",
                  )}
                >
                  {stage.layout === "monument" ? (
                    <>
                      <div className="relative z-30 mx-auto w-full max-w-xl shrink-0">
                        <p className="text-xs uppercase tracking-[0.22em] opacity-55">
                          {stage.eyebrow}
                        </p>
                        <h2 className="mt-2 font-display text-[clamp(2.5rem,6vw,3.75rem)] font-bold uppercase leading-[0.92] tracking-[-0.03em]">
                          {stage.label}
                        </h2>
                      </div>
                      <div
                        aria-hidden
                        className="min-h-[min(50svh,420px)] w-full flex-1"
                      />
                      <p className="relative z-30 mx-auto mb-4 max-w-md shrink-0 text-lg leading-relaxed opacity-85">
                        {stage.text}
                      </p>
                    </>
                  ) : (
                    <div className="relative z-30">
                      <p className="text-xs uppercase tracking-[0.22em] opacity-55">
                        {stage.eyebrow}
                      </p>
                      <h2
                        className={cn(
                          "mt-3 font-display font-bold uppercase tracking-[-0.02em]",
                          stage.layout === "backdrop" &&
                            "text-[clamp(2.5rem,5vw,4rem)] leading-[0.95]",
                          (stage.layout === "side" ||
                            stage.layout === "open") &&
                            "text-[clamp(2.1rem,4vw,3.25rem)] leading-[1.02]",
                        )}
                      >
                        {stage.label}
                      </h2>
                      <p
                        className={cn(
                          "mt-4 max-w-sm text-base leading-relaxed opacity-80 md:text-lg",
                          stage.layout === "open" && "ml-auto",
                        )}
                      >
                        {stage.text}
                      </p>
                      {stage.layout === "side" ? (
                        <ul className="mt-8 space-y-3 text-sm opacity-75">
                          <li className="flex items-center gap-3">
                            <span className="h-px w-8 bg-current/40" />
                            {product.feature}
                          </li>
                          <li className="flex items-center gap-3">
                            <span className="h-px w-8 bg-current/40" />
                            {product.flavorLabel}
                          </li>
                        </ul>
                      ) : null}
                    </div>
                  )}
                </div>
              ))}

              <p
                data-hold-hint
                className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-[0.65rem] uppercase tracking-[0.28em]"
              >
                Sigue explorando
              </p>
            </div>
          </div>
        </div>

        {!showPin ? (
          <div className="section-pad">
            {productStoryStages.map((stage) => (
              <div
                key={stage.id}
                className={cn(
                  "relative overflow-hidden py-16",
                  toneBg[stage.tone],
                  toneText[stage.tone],
                )}
              >
                <Container>
                  <h2 className="font-display text-3xl font-bold uppercase">
                    {stage.label}
                  </h2>
                  <p className="mt-4 max-w-md opacity-80">{stage.text}</p>
                </Container>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
