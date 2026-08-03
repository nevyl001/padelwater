"use client";

import { useRef } from "react";
import { heroContent, productStoryStages } from "@/data/site-content";
import { product } from "@/data/product";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { DotPattern } from "@/components/ui/DotPattern";
import { Container } from "@/components/ui/Container";
import { ProductCanStage } from "@/components/product/ProductCanStage";
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

export function LaunchExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const heroAnchorRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);

  const { prefersReducedMotion, isMobile, ready, layer } =
    useMotionPreferences();

  const { activeStage, conductorOn, storyVh } = useLaunchConductor(
    {
      rootRef,
      heroRef,
      storyRef,
      pinRef,
      heroAnchorRef,
      stageRef,
      heroCopyRef,
    },
    { ready, prefersReducedMotion, isMobile, layer },
  );

  const canUseConductor = ready && !prefersReducedMotion && !isMobile;
  const showDesktopPin = canUseConductor;
  const hideInlineCan = canUseConductor && conductorOn;

  const tone = productStoryStages[activeStage]?.tone ?? "navy";
  const canTone =
    tone === "lime-soft" ? "ice" : tone === "water" ? "water" : "navy";

  return (
    <div ref={rootRef} data-launch-experience>
      <ProductCanStage
        ref={stageRef}
        mode="fixed"
        tone={canTone}
        fitHeight
        priority
        showReflection
      />

      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] overflow-hidden bg-pw-navy-deep text-pw-white grain"
        aria-label="Presentación Pádel Water"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_65%_40%,rgba(183,243,51,0.08),transparent_50%),radial-gradient(ellipse_at_20%_80%,rgba(0,169,203,0.14),transparent_45%)]" />
        <div data-hero-dots>
          <DotPattern className="pointer-events-none absolute bottom-[-8%] right-[-4%] h-[40%] w-[40%] opacity-70" />
        </div>

        <Container className="relative z-10 flex w-full flex-1 items-center py-[calc(var(--header-offset)+2rem)] pb-20 lg:py-[calc(var(--header-offset)+3rem)]">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-10">
            <div
              ref={heroCopyRef}
              className="mx-auto w-full max-w-lg text-center lg:mx-0 lg:text-left"
            >
              <div data-hero-eyebrow>
                <SectionLabel tone="lime">{heroContent.eyebrow}</SectionLabel>
              </div>
              <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] font-bold uppercase leading-[1.05] tracking-[-0.02em]">
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
                className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/65 md:text-lg lg:mx-0"
              >
                {heroContent.description}
              </p>
              <div
                data-hero-late
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

            <div className="flex justify-center">
              <div ref={heroAnchorRef}>
                <div className={cn(hideInlineCan && "invisible")}>
                  <ProductCanStage mode="inline" tone="navy" fitHeight priority />
                </div>
              </div>
            </div>
          </div>
        </Container>

        <div className="absolute inset-x-0 bottom-6 flex justify-center">
          <a
            href="#producto"
            className="text-[0.65rem] uppercase tracking-[0.28em] text-white/45 hover:text-white/80"
          >
            Scroll
          </a>
        </div>
      </section>

      <section
        ref={storyRef}
        id="producto"
        className="relative anchor-offset"
        aria-label="Experiencia de producto"
        style={showDesktopPin ? { height: `${storyVh}vh` } : undefined}
      >
        <div
          ref={pinRef}
          className={cn("relative", !showDesktopPin && "hidden")}
        >
          <div
            data-story-backdrop
            className={cn(
              "relative h-svh overflow-hidden pt-[var(--header-offset)]",
              toneBg[tone],
              toneText[tone],
            )}
          >
            <Container className="relative flex h-full items-center">
              <div className="relative z-20 w-full max-w-md">
                {productStoryStages.map((stage) => (
                  <div
                    key={stage.id}
                    data-story-stage
                    className="absolute inset-x-0 top-1/2 w-full -translate-y-1/2"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] opacity-55">
                      {stage.eyebrow}
                    </p>
                    <h2
                      className={cn(
                        "mt-3 font-display font-bold uppercase tracking-[-0.02em]",
                        stage.layout === "monument" &&
                          "text-[clamp(3rem,7vw,5.5rem)] leading-[0.92]",
                        stage.layout === "backdrop" &&
                          "text-[clamp(2.5rem,5vw,4rem)] leading-[0.95]",
                        (stage.layout === "side" || stage.layout === "open") &&
                          "text-[clamp(2rem,4vw,3.25rem)] leading-[1.02]",
                      )}
                    >
                      {stage.label}
                    </h2>
                    <p className="mt-4 max-w-sm text-base leading-relaxed opacity-80 md:text-lg">
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
                    {stage.layout === "backdrop" ? (
                      <p
                        aria-hidden
                        className="pointer-events-none absolute -z-10 left-0 top-1/2 -translate-y-1/2 font-display text-[clamp(4rem,11vw,8rem)] font-bold uppercase leading-none opacity-[0.07]"
                      >
                        {stage.label}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
              <p
                data-hold-hint
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.65rem] uppercase tracking-[0.28em]"
              >
                Sigue explorando
              </p>
            </Container>
          </div>
        </div>

        <div className={cn(showDesktopPin && "md:hidden")}>
          {productStoryStages.map((stage, index) => (
            <div
              key={stage.id}
              className={cn(
                "section-pad",
                toneBg[stage.tone],
                toneText[stage.tone],
              )}
            >
              <Container>
                <div
                  className={cn(
                    "mx-auto flex max-w-md flex-col gap-8",
                    index % 2 === 0
                      ? "items-center text-center"
                      : "items-start text-left",
                  )}
                >
                  <div className="w-full">
                    <p className="text-xs uppercase tracking-[0.22em] opacity-55">
                      {stage.eyebrow}
                    </p>
                    <h2 className="mt-3 font-display text-[clamp(2rem,8vw,3rem)] font-bold uppercase leading-[1.02] tracking-[-0.02em]">
                      {stage.label}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed opacity-80">
                      {stage.text}
                    </p>
                    {index === 1 ? (
                      <ul className="mt-6 space-y-2 text-sm opacity-75">
                        <li>{product.feature}</li>
                        <li>{product.flavorLabel}</li>
                      </ul>
                    ) : null}
                  </div>
                  {index === 0 || index === 3 ? (
                    <div className="w-full max-w-[180px]">
                      <ProductCanStage
                        mode="inline"
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
                  ) : (
                    <div
                      aria-hidden
                      className="h-1 w-12 rounded-full bg-current/25"
                    />
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
