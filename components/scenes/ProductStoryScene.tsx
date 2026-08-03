"use client";

import { useRef } from "react";
import { productStoryStages } from "@/data/site-content";
import { product } from "@/data/product";
import { Container } from "@/components/ui/Container";
import { ProductCanStage } from "@/components/product/ProductCanStage";
import { CourtField } from "@/components/atmosphere/CourtField";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { SectionProgress } from "@/components/motion/SectionProgress";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { useProductStorySceneTimeline } from "@/components/scenes/useProductStorySceneTimeline";
import {
  canToneFromStage,
  courtTone,
  toneBg,
  toneText,
} from "@/components/scenes/storyTokens";
import { cn } from "@/lib/cn";

type Stage = (typeof productStoryStages)[number];

function desktopShellClass(layout: Stage["layout"]) {
  switch (layout) {
    case "monument":
      // Title only — lives in the top safe zone; body is rendered separately
      return "inset-x-0 top-0 h-[20%] px-[max(2rem,8%)] pt-6 text-center";
    case "backdrop":
      return "left-[max(2.5rem,calc((100vw-min(100vw,85rem))/2+1.5rem))] top-[22%] w-[min(26rem,34vw)] text-left";
    case "side":
      return "left-[max(2.5rem,calc((100vw-min(100vw,85rem))/2+1.5rem))] top-[22%] w-[min(22rem,28vw)] text-left";
    case "open":
      return "right-[max(2.5rem,calc((100vw-min(100vw,85rem))/2+1.5rem))] top-[22%] w-[min(22rem,28vw)] text-right";
    default:
      return "left-1/2 top-[22%] w-[min(28rem,88%)] -translate-x-1/2 text-center";
  }
}

/**
 * Product story — 4-stage pin/scrub.
 * Can is locked to a clipped middle band so it can never cover title or body.
 */
export function ProductStoryScene() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const holdHintRef = useRef<HTMLElement>(null);

  const { ready, prefersReducedMotion, isMobile, profile } = useMotionPreferences();

  const { activeStage } = useProductStorySceneTimeline(
    { rootRef, pinRef, canRef, stageRefs, holdHintRef },
    { ready, prefersReducedMotion, isMobile, storyVh: profile.storyVh },
  );

  const showPin = !prefersReducedMotion;
  const animateCourt = ready && !prefersReducedMotion;
  const tone = productStoryStages[activeStage]?.tone ?? "navy";
  const canTone = canToneFromStage(tone);
  const progressTone = tone === "lime-soft" ? "dark" : "light";
  const monument = productStoryStages.find((s) => s.layout === "monument");
  const monumentIndex = productStoryStages.findIndex((s) => s.layout === "monument");

  return (
    <>
      <div id="producto" className="anchor-offset h-0 scroll-mt-[var(--header-offset)]" />
      <section
        ref={rootRef}
        data-scene="product-story"
        className="relative"
        aria-label="Experiencia de producto"
        style={showPin ? { height: `${profile.storyVh}vh` } : undefined}
      >
        <div ref={pinRef} className={cn("relative", !showPin && "hidden")}>
          <div
            data-story-backdrop
            className={cn(
              "relative flex h-svh flex-col overflow-hidden pt-[var(--header-offset)] transition-colors duration-500",
              toneBg[tone],
              toneText[tone],
            )}
          >
            <CourtField tone={courtTone[tone]} intensity="medium" animated={animateCourt} />

            {isMobile ? (
              <>
                {/* TOP — copy only */}
                <div className="relative z-20 h-[5.75rem] shrink-0 overflow-hidden px-5 pt-2">
                  {productStoryStages.map((stage, index) => (
                    <div
                      key={stage.id}
                      ref={(el) => {
                        stageRefs.current[index] = el;
                      }}
                      data-story-stage
                      className={cn(
                        "absolute inset-x-5 top-2 text-center",
                        index === 0 ? "opacity-100" : "opacity-0",
                      )}
                    >
                      <p className="text-[0.58rem] uppercase tracking-[0.22em] opacity-55">
                        {String(index + 1).padStart(2, "0")} · {stage.eyebrow}
                      </p>
                      <MaskReveal as="div" mode="manual" splitBy="block">
                        <h2 className="mt-1 font-display text-[clamp(1.45rem,6.5vw,2rem)] font-bold uppercase leading-[1.02] tracking-[-0.03em]">
                          {stage.label}
                        </h2>
                      </MaskReveal>
                      {stage.layout !== "monument" ? (
                        <p className="mx-auto mt-1 line-clamp-2 max-w-[17rem] text-[0.75rem] leading-snug opacity-80">
                          {stage.text}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>

                {/* MIDDLE — can only, height-locked */}
                <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-hidden px-5 py-2">
                  <div
                    ref={canRef}
                    className="h-full max-h-full w-auto"
                    style={{ aspectRatio: "3 / 7", maxWidth: "min(148px, 38vw)" }}
                  >
                    <ProductCanStage
                      mode="inline"
                      tone={canTone}
                      size="inline"
                      quiet
                      showReflection={false}
                      className="h-full w-full [&_[data-product-can-image]]:!aspect-auto [&_[data-product-can-image]]:!h-full [&_[data-product-can-image]]:!w-full [&_[data-product-can-image]]:!max-w-none [&_[data-product-can-image]]:!shadow-none"
                    />
                  </div>
                </div>

                {/* BOTTOM — monument body + chrome */}
                <div className="relative z-20 flex h-[6.75rem] shrink-0 flex-col justify-start overflow-hidden px-5 pb-3 pt-1">
                  {monument ? (
                    <p
                      className={cn(
                        "text-center text-[0.78rem] leading-snug transition-opacity duration-300",
                        activeStage === monumentIndex
                          ? "opacity-85"
                          : "pointer-events-none opacity-0",
                      )}
                    >
                      {monument.text}
                    </p>
                  ) : null}
                  <div className="mt-auto">
                    <SectionProgress
                      total={productStoryStages.length}
                      active={activeStage}
                      tone={progressTone}
                      className="justify-center"
                    />
                    <p
                      ref={holdHintRef as React.Ref<HTMLParagraphElement>}
                      className="mt-1.5 text-center text-[0.55rem] uppercase tracking-[0.28em]"
                    >
                      Sigue explorando
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* DESKTOP: can locked to middle band — cannot enter title/body zones */}
                <div className="pointer-events-none absolute inset-x-0 top-[20%] bottom-[24%] z-[5] flex items-center justify-center overflow-hidden px-8">
                  <div
                    ref={canRef}
                    className="h-[min(100%,42svh)] w-auto max-w-[200px]"
                    style={{ aspectRatio: "3 / 7" }}
                  >
                    <ProductCanStage
                      mode="inline"
                      tone={canTone}
                      size="story"
                      quiet
                      showReflection={activeStage !== monumentIndex}
                      className="h-full w-full [&_[data-product-can-image]]:!aspect-auto [&_[data-product-can-image]]:!h-full [&_[data-product-can-image]]:!w-full [&_[data-product-can-image]]:!max-w-none [&_[data-product-can-image]]:!max-h-full"
                    />
                  </div>
                </div>

                <div className="relative z-20 h-full">
                  {productStoryStages.map((stage, index) => (
                    <div
                      key={stage.id}
                      ref={(el) => {
                        stageRefs.current[index] = el;
                      }}
                      data-story-stage
                      className={cn(
                        "absolute overflow-hidden",
                        desktopShellClass(stage.layout),
                        index === 0 ? "opacity-100" : "opacity-0",
                      )}
                    >
                      {stage.layout === "monument" ? (
                        <div className="mx-auto w-full max-w-xl">
                          <p className="text-xs uppercase tracking-[0.22em] opacity-55">
                            {stage.eyebrow}
                          </p>
                          <MaskReveal as="div" mode="manual" splitBy="block">
                            <h2 className="mt-2 font-display text-[clamp(2.1rem,4.5vw,3.1rem)] font-bold uppercase leading-[0.92] tracking-[-0.03em]">
                              {stage.label}
                            </h2>
                          </MaskReveal>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] opacity-55">
                            {stage.eyebrow}
                          </p>
                          <MaskReveal as="div" mode="manual" splitBy="block">
                            <h2
                              className={cn(
                                "mt-3 font-display font-bold uppercase tracking-[-0.02em]",
                                stage.layout === "backdrop" &&
                                  "text-[clamp(2.5rem,5vw,4rem)] leading-[0.95]",
                                (stage.layout === "side" || stage.layout === "open") &&
                                  "text-[clamp(2.1rem,4vw,3.25rem)] leading-[1.02]",
                              )}
                            >
                              {stage.label}
                            </h2>
                          </MaskReveal>
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

                  {/* Bottom safe zone — monument body never shares pixels with the can */}
                  <div className="absolute inset-x-0 bottom-0 z-30 flex h-[24%] flex-col items-center justify-end overflow-hidden px-[max(2rem,8%)] pb-8">
                    {monument ? (
                      <p
                        className={cn(
                          "mb-6 max-w-md text-center text-lg leading-relaxed transition-opacity duration-300",
                          activeStage === monumentIndex
                            ? "opacity-85"
                            : "pointer-events-none opacity-0",
                        )}
                      >
                        {monument.text}
                      </p>
                    ) : null}
                    <SectionProgress
                      total={productStoryStages.length}
                      active={activeStage}
                      tone={progressTone}
                      className="justify-center"
                    />
                    <p
                      ref={holdHintRef as React.Ref<HTMLParagraphElement>}
                      className="mt-2 text-[0.65rem] uppercase tracking-[0.28em]"
                    >
                      Sigue explorando
                    </p>
                  </div>
                </div>
              </>
            )}
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
                  <h2 className="font-display text-3xl font-bold uppercase">{stage.label}</h2>
                  <p className="mt-4 max-w-md opacity-80">{stage.text}</p>
                </Container>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </>
  );
}
