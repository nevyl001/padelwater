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
      return "left-[max(2rem,calc((100vw-min(100vw,85rem))/2+2rem))] top-[26%] w-[min(28rem,38vw)] text-left";
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
 * Monument (470): copy left + can right. Stable DOM so GSAP keeps the can.
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
  const isMonument = activeStage === 3;

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
              <div
                className={cn(
                  "relative z-10 flex min-h-0 flex-1 overflow-hidden px-5",
                  isMonument
                    ? "flex-row items-center gap-3 pb-14 pt-4"
                    : "flex-col pb-3 pt-2",
                )}
              >
                {/* Stages — left column on monument, top band otherwise */}
                <div
                  className={cn(
                    "relative z-20 overflow-hidden",
                    isMonument
                      ? "min-w-0 flex-1"
                      : "h-[5.75rem] w-full shrink-0",
                  )}
                >
                  {productStoryStages.map((stage, index) => (
                    <div
                      key={stage.id}
                      ref={(el) => {
                        stageRefs.current[index] = el;
                      }}
                      data-story-stage
                      className={cn(
                        isMonument
                          ? cn(
                              "text-left",
                              stage.layout === "monument"
                                ? "relative"
                                : "pointer-events-none absolute inset-0 opacity-0",
                            )
                          : cn(
                              "absolute inset-x-0 top-0 text-center",
                              index === 0 ? "opacity-100" : "opacity-0",
                            ),
                      )}
                    >
                      <p className="text-[0.58rem] uppercase tracking-[0.22em] opacity-55">
                        {String(index + 1).padStart(2, "0")} · {stage.eyebrow}
                      </p>
                      <MaskReveal as="div" mode="manual" splitBy="block">
                        <h2
                          className={cn(
                            "mt-1 font-display font-bold uppercase tracking-[-0.03em]",
                            isMonument && stage.layout === "monument"
                              ? "text-[clamp(1.8rem,9vw,2.4rem)] leading-[0.95]"
                              : "text-[clamp(1.45rem,6.5vw,2rem)] leading-[1.02]",
                          )}
                        >
                          {stage.label}
                        </h2>
                      </MaskReveal>
                      <p
                        className={cn(
                          "leading-snug opacity-80",
                          isMonument && stage.layout === "monument"
                            ? "mt-3 max-w-[14rem] text-[0.78rem]"
                            : "mx-auto mt-1 line-clamp-2 max-w-[17rem] text-[0.75rem]",
                        )}
                      >
                        {stage.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Can — right on monument, centered otherwise. Same node always. */}
                <div
                  className={cn(
                    "relative z-10 flex items-center overflow-hidden",
                    isMonument
                      ? "w-[min(128px,34vw)] shrink-0 justify-end"
                      : "min-h-0 w-full flex-1 justify-center py-3",
                  )}
                >
                  <div
                    ref={canRef}
                    className={cn(
                      "shrink-0",
                      isMonument ? "w-full" : "w-[min(158px,40vw)]",
                    )}
                  >
                    <ProductCanStage
                      mode="inline"
                      tone={canTone}
                      size="inline"
                      quiet
                      showReflection={false}
                    />
                  </div>
                </div>

                <div
                  className={cn(
                    "z-30",
                    isMonument
                      ? "absolute inset-x-0 bottom-3 px-5"
                      : "relative flex h-[4.25rem] w-full shrink-0 flex-col justify-end",
                  )}
                >
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
            ) : (
              <>
                <div
                  className={cn(
                    "pointer-events-none absolute inset-y-0 z-[5] flex items-center overflow-hidden transition-[inset] duration-300",
                    isMonument
                      ? "right-0 w-[46%] justify-center pr-[max(2rem,6%)]"
                      : "inset-x-0 justify-center px-8",
                  )}
                >
                  <div
                    ref={canRef}
                    className={cn(
                      "shrink-0",
                      isMonument ? "w-[min(200px,18vw)]" : "w-[min(220px,20vw)]",
                    )}
                  >
                    <ProductCanStage
                      mode="inline"
                      tone={canTone}
                      size="inline"
                      quiet
                      showReflection={!isMonument}
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
                        <div className="max-w-xl">
                          <p className="text-xs uppercase tracking-[0.22em] opacity-55">
                            {stage.eyebrow}
                          </p>
                          <MaskReveal as="div" mode="manual" splitBy="block">
                            <h2 className="mt-2 font-display text-[clamp(2.4rem,5vw,3.5rem)] font-bold uppercase leading-[0.92] tracking-[-0.03em]">
                              {stage.label}
                            </h2>
                          </MaskReveal>
                          <p className="mt-5 max-w-sm text-lg leading-relaxed opacity-85">
                            {stage.text}
                          </p>
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

                  <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center px-[max(2rem,8%)] pb-8">
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
