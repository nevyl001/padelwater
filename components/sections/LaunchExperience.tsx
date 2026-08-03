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
import { cn } from "@/lib/cn";

const toneBg = {
  navy: "bg-pw-navy-deep",
  water: "bg-[#087A9A]",
  ice: "bg-pw-ice",
  "lime-soft": "bg-[#d8f08a]",
} as const;

const toneText = {
  navy: "text-pw-white",
  water: "text-pw-white",
  ice: "text-pw-navy",
  "lime-soft": "text-pw-navy",
} as const;

const courtTone = {
  navy: "dark" as const,
  water: "water" as const,
  ice: "light" as const,
  "lime-soft": "lime" as const,
};

function stageShellClass(layout: (typeof productStoryStages)[number]["layout"]) {
  // Mobile: always full-viewport bands (copy top / can middle). Desktop: editorial side layouts.
  const mobileBands =
    "inset-0 flex flex-col px-5 pt-1 pb-14 text-center";

  switch (layout) {
    case "monument":
      return cn(
        "inset-0 flex flex-col justify-between px-5 pt-2 pb-16 text-center sm:px-[max(2rem,8%)] sm:pt-4 sm:pb-20",
      );
    case "backdrop":
      return cn(
        mobileBands,
        "md:inset-auto md:left-[max(2.5rem,calc((100vw-min(100vw,85rem))/2+1.5rem))] md:top-[18%] md:bottom-auto md:right-auto md:block md:w-[min(26rem,34vw)] md:px-0 md:pb-0 md:pt-0 md:text-left",
      );
    case "side":
      return cn(
        mobileBands,
        "md:inset-auto md:left-[max(2.5rem,calc((100vw-min(100vw,85rem))/2+1.5rem))] md:top-[16%] md:bottom-auto md:right-auto md:block md:w-[min(22rem,28vw)] md:px-0 md:pb-0 md:pt-0 md:text-left",
      );
    case "open":
      return cn(
        mobileBands,
        "md:inset-auto md:left-auto md:right-[max(2.5rem,calc((100vw-min(100vw,85rem))/2+1.5rem))] md:top-[18%] md:bottom-auto md:block md:w-[min(22rem,28vw)] md:px-0 md:pb-0 md:pt-0 md:text-right",
      );
    default:
      return mobileBands;
  }
}

export function LaunchExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const heroCanRef = useRef<HTMLDivElement>(null);
  const storyCanRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);

  const { prefersReducedMotion, isMobile, ready, layer } =
    useMotionPreferences();

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
    { ready, prefersReducedMotion, isMobile, layer },
  );

  // Same pin+scrub theatre on phone and desktop (stack only if reduced motion)
  const showPin = !prefersReducedMotion;
  const animateCourt = ready && !prefersReducedMotion;

  const tone = productStoryStages[activeStage]?.tone ?? "navy";
  const canTone =
    tone === "lime-soft" ? "ice" : tone === "water" ? "water" : "navy";

  return (
    <div ref={rootRef} data-launch-experience className="relative">
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] overflow-hidden bg-pw-navy-deep text-pw-white grain"
        aria-label="Presentación Pádel Water"
      >
        <CourtField tone="dark" intensity="medium" animated={animateCourt} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_35%,rgba(0,169,203,0.18),transparent_42%),radial-gradient(ellipse_at_20%_70%,rgba(183,243,51,0.1),transparent_40%)]" />

        <Container className="relative z-10 flex w-full flex-1 items-end pb-16 pt-[calc(var(--header-offset)+1.5rem)] md:items-center md:pb-20 md:pt-[calc(var(--header-offset)+2.5rem)]">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16 xl:gap-20">
            <div
              ref={heroCopyRef}
              className="mx-auto w-full max-w-xl text-center sm:px-2 lg:mx-0 lg:max-w-[34rem] lg:justify-self-start lg:px-0 lg:pl-4 lg:text-left xl:pl-8"
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
                className="mx-auto mt-6 max-w-md text-base leading-relaxed text-white/70 md:text-lg lg:mx-0 lg:max-w-md"
              >
                {heroContent.description}
              </p>
              <div
                data-hero-late
                className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start"
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

            <div className="relative flex min-h-[min(52svh,400px)] items-center justify-center lg:min-h-[min(68svh,500px)]">
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-[10%] left-1/2 h-24 w-[55%] -translate-x-1/2 rounded-[100%] bg-pw-cyan/25 blur-3xl"
              />
              <div ref={heroCanRef} className="relative z-10">
                <ProductCanStage mode="inline" tone="navy" size="hero" priority />
              </div>
            </div>
          </div>
        </Container>

        <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center md:bottom-7">
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
        id="producto"
        className="relative anchor-offset"
        aria-label="Experiencia de producto"
        style={showPin ? { height: `${storyVh}vh` } : undefined}
      >
        <div
          ref={pinRef}
          className={cn("relative", !showPin && "hidden")}
        >
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

            {/* Can: centered; shrinks on monument so title/body stay clear */}
            <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center max-md:items-start max-md:pt-[42%] md:pt-[calc(var(--header-offset)*0.35)]">
              <div
                ref={storyCanRef}
                className={cn(
                  activeStage === 3 && "max-md:scale-[0.88] md:scale-[0.8]",
                )}
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
                        <p className="text-[0.65rem] uppercase tracking-[0.22em] opacity-55 md:text-xs">
                          {stage.eyebrow}
                        </p>
                        <h2 className="mt-2 font-display text-[clamp(2.2rem,8vw,3.75rem)] font-bold uppercase leading-[0.92] tracking-[-0.03em]">
                          {stage.label}
                        </h2>
                      </div>
                      <div
                        aria-hidden
                        className="relative z-0 min-h-[min(44svh,360px)] w-full flex-1 md:min-h-[min(50svh,420px)]"
                      />
                      <p className="relative z-30 mx-auto mb-2 max-w-[20rem] shrink-0 text-[0.95rem] leading-relaxed opacity-85 md:mb-4 md:max-w-md md:text-base md:text-lg">
                        {stage.text}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="relative z-30 mx-auto w-full max-w-md shrink-0 md:mx-0 md:max-w-none">
                        <p className="text-[0.65rem] uppercase tracking-[0.22em] opacity-55 md:text-xs">
                          {stage.eyebrow}
                        </p>
                        <h2
                          className={cn(
                            "mt-2 font-display font-bold uppercase tracking-[-0.02em]",
                            stage.layout === "backdrop" &&
                              "text-[clamp(2rem,8vw,4rem)] leading-[0.95]",
                            (stage.layout === "side" ||
                              stage.layout === "open") &&
                              "text-[clamp(1.9rem,7.5vw,3.25rem)] leading-[1.02]",
                          )}
                        >
                          {stage.label}
                        </h2>
                        <p
                          className={cn(
                            "mt-3 text-[0.95rem] leading-relaxed opacity-80 md:mt-4 md:text-base md:text-lg",
                            "mx-auto max-w-[20rem] md:mx-0 md:max-w-sm",
                            stage.layout === "open" && "md:ml-auto",
                          )}
                        >
                          {stage.text}
                        </p>
                        {stage.layout === "side" ? (
                          <ul className="mt-4 space-y-2 text-sm opacity-75 md:mt-8 md:space-y-3">
                            <li className="flex items-center justify-center gap-3 md:justify-start">
                              <span className="h-px w-8 bg-current/40" />
                              {product.feature}
                            </li>
                            <li className="flex items-center justify-center gap-3 md:justify-start">
                              <span className="h-px w-8 bg-current/40" />
                              {product.flavorLabel}
                            </li>
                          </ul>
                        ) : null}
                      </div>
                      <div
                        aria-hidden
                        className="relative z-0 min-h-[min(40svh,300px)] w-full flex-1 md:hidden"
                      />
                    </>
                  )}
                </div>
              ))}

              <p
                data-hold-hint
                className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 text-[0.65rem] uppercase tracking-[0.28em] md:bottom-8"
              >
                Sigue explorando
              </p>
            </div>
          </div>
        </div>

        {/* Reduced-motion / no-JS friendly fallback stack */}
        <div className={cn(showPin && "hidden")}>
          {productStoryStages.map((stage, index) => (
            <div
              key={stage.id}
              className={cn(
                "relative overflow-hidden section-pad",
                toneBg[stage.tone],
                toneText[stage.tone],
              )}
            >
              <CourtField
                tone={courtTone[stage.tone]}
                intensity="soft"
                animated={false}
              />
              <Container className="relative z-10">
                <div className="mx-auto flex max-w-md flex-col items-center gap-8 text-center">
                  <div className="w-full">
                    <p className="text-xs uppercase tracking-[0.22em] opacity-55">
                      {stage.eyebrow}
                    </p>
                    <h2 className="mt-3 font-display text-[clamp(2.25rem,9vw,3.25rem)] font-bold uppercase leading-[1.02] tracking-[-0.02em]">
                      {stage.label}
                    </h2>
                    <p className="mx-auto mt-4 max-w-md text-base leading-relaxed opacity-80">
                      {stage.text}
                    </p>
                    {index === 1 ? (
                      <ul className="mt-6 space-y-2 text-sm opacity-75">
                        <li>{product.feature}</li>
                        <li>{product.flavorLabel}</li>
                      </ul>
                    ) : null}
                  </div>
                  {(index === 0 || index === 3) && (
                    <div className="w-full max-w-[200px]">
                      <ProductCanStage
                        mode="inline"
                        size="inline"
                        quiet={index === 3}
                        tone={
                          stage.tone === "lime-soft"
                            ? "ice"
                            : stage.tone === "water"
                              ? "water"
                              : "navy"
                        }
                        showReflection={index === 3}
                      />
                    </div>
                  )}
                </div>
              </Container>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
