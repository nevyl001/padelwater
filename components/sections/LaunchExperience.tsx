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

function stageCopyClass(layout: (typeof productStoryStages)[number]["layout"]) {
  switch (layout) {
    case "backdrop":
      return "left-[max(2.5rem,calc((100vw-min(100vw,85rem))/2+1.5rem))] right-auto top-[26%] w-[min(26rem,38vw)] text-left";
    case "side":
      return "left-[max(2.5rem,calc((100vw-min(100vw,85rem))/2+1.5rem))] right-auto top-1/2 w-[min(22rem,32vw)] -translate-y-1/2 text-left";
    case "open":
      return "left-auto right-[max(2.5rem,calc((100vw-min(100vw,85rem))/2+1.5rem))] top-[30%] w-[min(22rem,32vw)] text-right";
    case "monument":
      return "inset-x-[max(2rem,6%)] top-[16%] mx-auto w-[min(36rem,88%)] text-center";
    default:
      return "left-1/2 top-1/2 w-[min(28rem,88%)] -translate-x-1/2 -translate-y-1/2 text-center";
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

  const canUseConductor = ready && !prefersReducedMotion && !isMobile;
  const showDesktopPin = canUseConductor;
  const animateCourt = ready && !prefersReducedMotion;

  const tone = productStoryStages[activeStage]?.tone ?? "navy";
  const activeLayout =
    productStoryStages[activeStage]?.layout ?? ("backdrop" as const);
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
              <div data-hero-brand className="mb-6 lg:mb-8">
                <p
                  className="font-display text-[clamp(1.6rem,3.2vw,2.35rem)] font-bold uppercase leading-none tracking-[0.06em]"
                  aria-hidden
                >
                  <span className="text-pw-cyan">Pádel</span>{" "}
                  <span className="text-pw-lime">Water</span>
                </p>
              </div>
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
                <ProductCanStage mode="inline" tone="navy" fitHeight priority />
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
        style={showDesktopPin ? { height: `${storyVh}vh` } : undefined}
      >
        <div
          ref={pinRef}
          className={cn("relative", !showDesktopPin && "hidden")}
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
              intensity="soft"
              animated={animateCourt}
            />

            {(activeLayout === "monument" || activeLayout === "backdrop") && (
              <p
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-[42%] z-0 -translate-y-1/2 text-center font-display text-[clamp(4.5rem,16vw,12rem)] font-bold uppercase leading-none tracking-[-0.04em] opacity-[0.08]"
              >
                {productStoryStages[activeStage]?.label}
              </p>
            )}

            {/* Story can lives INSIDE the pin — never site-fixed */}
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <div ref={storyCanRef}>
                <ProductCanStage
                  mode="inline"
                  tone={canTone}
                  fitHeight
                  showReflection
                />
              </div>
            </div>

            <div className="relative z-20 h-full">
              {productStoryStages.map((stage) => (
                <div
                  key={stage.id}
                  data-story-stage
                  className={cn("absolute px-2", stageCopyClass(stage.layout))}
                >
                  <p className="text-xs uppercase tracking-[0.22em] opacity-55">
                    {stage.eyebrow}
                  </p>
                  <h2
                    className={cn(
                      "mt-3 font-display font-bold uppercase tracking-[-0.02em]",
                      stage.layout === "monument" &&
                        "text-[clamp(3.25rem,8vw,5.75rem)] leading-[0.9]",
                      stage.layout === "backdrop" &&
                        "text-[clamp(2.5rem,5vw,4rem)] leading-[0.95]",
                      (stage.layout === "side" || stage.layout === "open") &&
                        "text-[clamp(2.1rem,4vw,3.25rem)] leading-[1.02]",
                    )}
                  >
                    {stage.label}
                  </h2>
                  <p
                    className={cn(
                      "mt-4 text-base leading-relaxed opacity-80 md:text-lg",
                      stage.layout === "monument" && "mx-auto max-w-md",
                      stage.layout === "open" && "ml-auto max-w-sm",
                      stage.layout !== "monument" &&
                        stage.layout !== "open" &&
                        "max-w-sm",
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

        <div className={cn(showDesktopPin && "md:hidden")}>
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
                <div className="mx-auto flex max-w-lg flex-col items-center gap-10 text-center">
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
                  <div className="w-full max-w-[200px]">
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
                </div>
              </Container>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
