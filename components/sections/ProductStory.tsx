"use client";

import { useEffect, useRef, useState } from "react";
import { productStoryStages } from "@/data/site-content";
import { ProductCan } from "@/components/product/ProductCan";
import { Container } from "@/components/ui/Container";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { cn } from "@/lib/cn";

const toneClasses = {
  navy: "bg-pw-navy text-pw-white",
  water: "bg-[#087A9A] text-pw-white",
  ice: "bg-pw-ice text-pw-navy",
  "lime-soft": "bg-pw-lime-soft text-pw-navy",
} as const;

export function ProductStory() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canRef = useRef<HTMLDivElement>(null);
  const { profile, prefersReducedMotion, isMobile, ready } =
    useMotionPreferences();
  const [active, setActive] = useState(0);

  const stages = isMobile
    ? productStoryStages.filter((_, i) => i !== 2)
    : [...productStoryStages];

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const can = canRef.current;
    if (!ready || !root || !pin || !can) return;
    if (prefersReducedMotion) return;

    let reverted: (() => void) | undefined;
    const stageCount = isMobile ? 3 : 4;

    async function run() {
      const { getGsap } = await import("@/lib/gsap");
      const { gsap, ScrollTrigger } = getGsap();

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobileView: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop } = context.conditions as {
            isDesktop: boolean;
          };

          // Subtle drift from the centered base position
          const positions = isDesktop
            ? [
                { xPercent: 0, scale: 1 },
                { xPercent: -6, scale: 1.04 },
                { xPercent: 6, scale: 0.98 },
                { xPercent: 0, scale: 1.06 },
              ]
            : [
                { xPercent: 0, scale: 0.94 },
                { xPercent: 0, scale: 1 },
                { xPercent: 0, scale: 0.97 },
              ];

          const texts = gsap.utils.toArray<HTMLElement>(
            root!.querySelectorAll("[data-stage]"),
          );

          gsap.set(can, {
            xPercent: positions[0].xPercent,
            scale: positions[0].scale,
          });
          gsap.set(texts, { opacity: 0, y: 24 });
          if (texts[0]) gsap.set(texts[0], { opacity: 1, y: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: () => `+=${profile.storyVh * (window.innerHeight / 100)}`,
              pin: pin,
              scrub: 0.65,
              anticipatePin: 1,
              onUpdate: (self) => {
                const idx = Math.min(
                  stageCount - 1,
                  Math.floor(self.progress * stageCount),
                );
                setActive(idx);
              },
            },
          });

          for (let i = 1; i < texts.length; i += 1) {
            const pos = positions[Math.min(i, positions.length - 1)];
            tl.to(
              can,
              {
                xPercent: pos.xPercent,
                scale: pos.scale,
                duration: 1,
                ease: "none",
              },
              i,
            )
              .to(texts[i - 1], { opacity: 0, y: -18, duration: 0.45 }, i)
              .fromTo(
                texts[i],
                { opacity: 0, y: 24 },
                { opacity: 1, y: 0, duration: 0.45 },
                i + 0.15,
              );
          }

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        },
      );

      reverted = () => {
        mm.revert();
        ScrollTrigger.getAll()
          .filter((t) => t.trigger === root)
          .forEach((t) => t.kill());
      };
    }

    void run();

    return () => {
      reverted?.();
    };
  }, [prefersReducedMotion, profile.storyVh, ready, isMobile]);

  const currentTone = stages[active]?.tone ?? "navy";

  return (
    <section
      ref={rootRef}
      id="producto"
      className="relative anchor-offset"
      aria-label="Experiencia de producto"
      style={
        prefersReducedMotion
          ? undefined
          : { height: `${profile.storyVh}vh` }
      }
    >
      <div
        ref={pinRef}
        className={cn(
          "relative flex min-h-[100svh] items-center overflow-hidden transition-colors duration-500",
          toneClasses[currentTone],
        )}
      >
        <Container className="relative z-10 w-full">
          <div
            className={cn(
              "relative",
              prefersReducedMotion
                ? "flex flex-col items-center gap-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10"
                : "flex min-h-[70svh] flex-col items-center justify-center lg:min-h-[28rem]",
            )}
          >
            {/* Copy */}
            <div
              className={cn(
                "relative z-20 w-full max-w-md",
                prefersReducedMotion
                  ? "order-2 text-center lg:order-1 lg:text-left"
                  : "order-1 mb-10 text-center lg:absolute lg:left-0 lg:top-1/2 lg:mb-0 lg:max-w-sm lg:-translate-y-1/2 lg:text-left xl:max-w-md",
              )}
            >
              <div
                className={cn(
                  "relative",
                  !prefersReducedMotion && "min-h-[10rem] lg:min-h-[14rem]",
                )}
              >
                {stages.map((stage, index) => (
                  <div
                    key={stage.id}
                    data-stage
                    className={cn(
                      prefersReducedMotion
                        ? cn("relative", index > 0 && "mt-12")
                        : "absolute inset-x-0 top-0",
                    )}
                  >
                    <p className="text-xs uppercase tracking-[0.24em] opacity-60">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="mt-3 text-editorial">{stage.label}</h2>
                    <p className="mt-5 text-body-lg opacity-80">{stage.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Can — centered in the stage */}
            <div
              className={cn(
                "relative z-10 flex w-full justify-center",
                prefersReducedMotion ? "order-1 lg:order-2" : "order-2",
              )}
            >
              <div
                ref={canRef}
                className="w-full max-w-[240px] lg:max-w-[260px]"
              >
                <ProductCan
                  className="max-w-none"
                  tone={
                    currentTone === "ice" || currentTone === "lime-soft"
                      ? "ice"
                      : "navy"
                  }
                  showReflection
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
