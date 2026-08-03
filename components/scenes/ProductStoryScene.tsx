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
      return "inset-0 grid grid-rows-[auto_minmax(0,1fr)_auto] px-[max(2rem,8%)] pb-28 pt-8 text-center";
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
 * Product story — 4-stage pin/scrub, fully independent from HeroScene.
 * Stage labels reuse the same MaskReveal system as the hero; the
 * crossfade between stages is a continuous scrub, a different
 * interaction pattern from a one-shot entrance, so it stays on raw
 * GSAP tweens rather than forcing MaskReveal's own trigger modes.
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
              "relative overflow-hidden pt-[var(--header-offset)] transition-colors duration-500",
              isMobile ? "flex h-svh flex-col" : "h-svh",
              toneBg[tone],
              toneText[tone],
            )}
          >
            <CourtField tone={courtTone[tone]} intensity="medium" animated={animateCourt} />

            {isMobile ? (
              <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-5 pb-6 pt-2">
                <div className="relative z-20 h-[6.1rem] w-full max-w-sm shrink-0 overflow-hidden">
                  {productStoryStages.map((stage, index) => (
                    <div
                      key={stage.id}
                      ref={(el) => {
                        stageRefs.current[index] = el;
                      }}
                      data-story-stage
                      className={cn(
                        "absolute inset-x-0 top-0 text-center",
                        index === 0 ? "opacity-100" : "opacity-0",
                      )}
                    >
                      <p className="text-[0.58rem] uppercase tracking-[0.22em] opacity-55">
                        {String(index + 1).padStart(2, "0")} · {stage.eyebrow}
                      </p>
                      <MaskReveal as="div" mode="manual" splitBy="block">
                        <h2 className="mt-1 font-display text-[clamp(1.55rem,7vw,2.15rem)] font-bold uppercase leading-[1.02] tracking-[-0.03em]">
                          {stage.label}
                        </h2>
                      </MaskReveal>
                      {stage.layout !== "monument" ? (
                        <p className="mx-auto mt-1.5 line-clamp-2 max-w-[17rem] text-[0.78rem] leading-snug opacity-80">
                          {stage.text}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div
                  ref={canRef}
                  className="w-[min(178px,48vw)] shrink-0 [&_[data-product-can-image]]:max-h-[min(50svh,380px)]"
                >
                  <ProductCanStage
                    mode="inline"
                    tone={canTone}
                    size="inline"
                    quiet
                    showReflection={false}
                  />
                </div>

                <div className="relative z-20 mt-3 min-h-[4.5rem] w-full max-w-sm shrink-0">
                  {productStoryStages.map((stage, index) =>
                    stage.layout === "monument" ? (
                      <p
                        key={`bot-${stage.id}`}
                        className={cn(
                          "px-1 text-center text-[0.8rem] leading-snug transition-opacity duration-300",
                          activeStage === index
                            ? "opacity-85"
                            : "pointer-events-none absolute inset-x-0 top-0 opacity-0",
                        )}
                      >
                        {stage.text}
                      </p>
                    ) : null,
                  )}
                  <SectionProgress
                    total={productStoryStages.length}
                    active={activeStage}
                    tone={progressTone}
                    className="mt-4 justify-center"
                  />
                  <p
                    ref={holdHintRef as React.Ref<HTMLParagraphElement>}
                    className="mt-2 text-center text-[0.55rem] uppercase tracking-[0.28em]"
                  >
                    Sigue explorando
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 z-[5] flex items-center justify-center px-6",
                    activeStage === 3
                      ? "pb-[7.5rem] pt-[calc(var(--header-offset)+5.25rem)]"
                      : "pt-[calc(var(--header-offset)*0.35)]",
                  )}
                >
                  <div
                    ref={canRef}
                    className={cn(
                      "flex max-h-full items-center justify-center",
                      activeStage === 3 &&
                        "[&_[data-product-can-image]]:!h-[min(48svh,420px)] [&_[data-product-can-image]]:!shadow-[0_14px_32px_rgba(3,17,38,0.16)]",
                    )}
                  >
                    <ProductCanStage
                      mode="inline"
                      tone={canTone}
                      size="story"
                      quiet
                      showReflection={activeStage !== 3}
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
                        "absolute",
                        desktopShellClass(stage.layout),
                        index === 0 ? "opacity-100" : "opacity-0",
                      )}
                    >
                      {stage.layout === "monument" ? (
                        <>
                          <div className="relative z-30 mx-auto w-full max-w-xl shrink-0">
                            <p className="text-xs uppercase tracking-[0.22em] opacity-55">
                              {stage.eyebrow}
                            </p>
                            <MaskReveal as="div" mode="manual" splitBy="block">
                              <h2 className="mt-2 font-display text-[clamp(2.2rem,4.8vw,3.25rem)] font-bold uppercase leading-[0.92] tracking-[-0.03em]">
                                {stage.label}
                              </h2>
                            </MaskReveal>
                          </div>
                          {/* Empty middle row — can lives in the absolute layer above */}
                          <div aria-hidden className="min-h-0" />
                          <p className="relative z-30 mx-auto mb-12 max-w-md shrink-0 text-lg leading-relaxed opacity-85">
                            {stage.text}
                          </p>
                        </>
                      ) : (
                        <div className="relative z-30">
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

                  <SectionProgress
                    total={productStoryStages.length}
                    active={activeStage}
                    tone={progressTone}
                    className="absolute bottom-14 left-1/2 z-30 -translate-x-1/2 justify-center"
                  />
                  <p
                    ref={holdHintRef as React.Ref<HTMLParagraphElement>}
                    className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-[0.65rem] uppercase tracking-[0.28em]"
                  >
                    Sigue explorando
                  </p>
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
