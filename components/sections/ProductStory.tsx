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
  "lime-soft": "bg-[#d8f08a] text-pw-navy",
} as const;

function StageCopy({
  index,
  label,
  text,
}: {
  index: number;
  label: string;
  text: string;
}) {
  return (
    <>
      <p className="text-xs uppercase tracking-[0.24em] opacity-60">
        {String(index + 1).padStart(2, "0")}
      </p>
      <h2 className="mt-3 text-[clamp(2rem,4vw,3.5rem)] font-display font-bold uppercase leading-[1.05] tracking-[-0.02em]">
        {label}
      </h2>
      <p className="mt-4 max-w-sm text-base leading-relaxed opacity-80 md:text-lg">
        {text}
      </p>
    </>
  );
}

export function ProductStory() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion, ready } = useMotionPreferences();
  const [active, setActive] = useState(0);
  const [desktopStory, setDesktopStory] = useState(false);

  const currentTone = productStoryStages[active]?.tone ?? "navy";
  const stageCount = productStoryStages.length;
  /** One viewport per stage + one extra so the last stage holds before unpin */
  const storyLengthVh = (stageCount + 1) * 100;

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const can = canRef.current;
    if (!ready || !root || !pin || !can || prefersReducedMotion) {
      setDesktopStory(false);
      return;
    }

    let reverted: (() => void) | undefined;

    async function run() {
      const { getGsap } = await import("@/lib/gsap");
      const { gsap, ScrollTrigger } = getGsap();
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        setDesktopStory(true);

        const texts = gsap.utils.toArray<HTMLElement>(
          pin!.querySelectorAll("[data-stage-desktop]"),
        );

        gsap.set(can, { x: 0, scale: 1, transformOrigin: "50% 50%" });
        gsap.set(texts, { autoAlpha: 0, y: 28 });
        if (texts[0]) gsap.set(texts[0], { autoAlpha: 1, y: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${storyLengthVh * (window.innerHeight / 100)}`,
            pin: pin,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Map progress across stages; last stage keeps the final slice
              const raw = self.progress * stageCount;
              const idx = Math.min(stageCount - 1, Math.floor(raw));
              setActive(idx);
            },
          },
        });

        // Equal segments: enter stage i, hold, then crossfade to next
        for (let i = 1; i < texts.length; i += 1) {
          const at = i;
          tl.to(
            texts[i - 1],
            { autoAlpha: 0, y: -20, duration: 0.35, ease: "none" },
            at,
          )
            .fromTo(
              texts[i],
              { autoAlpha: 0, y: 24 },
              { autoAlpha: 1, y: 0, duration: 0.35, ease: "none" },
              at + 0.05,
            )
            .to(
              can,
              {
                scale: i % 2 === 0 ? 1.03 : 0.98,
                duration: 1,
                ease: "none",
              },
              at,
            );
        }

        // Hold on last stage (empty tween absorbs remaining scroll)
        tl.to({}, { duration: 1.15 }, stageCount);

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          setDesktopStory(false);
          setActive(0);
          gsap.set(can, { clearProps: "transform" });
          gsap.set(texts, { clearProps: "all" });
        };
      });

      mm.add("(max-width: 767px)", () => {
        setDesktopStory(false);
        setActive(0);
      });

      reverted = () => {
        mm.revert();
        ScrollTrigger.getAll()
          .filter((t) => t.trigger === root)
          .forEach((t) => t.kill());
      };
    }

    void run();
    return () => reverted?.();
  }, [prefersReducedMotion, ready, stageCount, storyLengthVh]);

  return (
    <section
      ref={rootRef}
      id="producto"
      className="relative anchor-offset"
      aria-label="Experiencia de producto"
      style={
        desktopStory && !prefersReducedMotion
          ? { height: `${storyLengthVh}vh` }
          : undefined
      }
    >
      {/* Desktop sticky story */}
      <div
        ref={pinRef}
        className={cn(
          "relative hidden transition-colors duration-500 md:block",
          prefersReducedMotion && "md:hidden",
          toneClasses[currentTone],
        )}
      >
        <div className="relative h-svh overflow-hidden pt-[var(--header-height)]">
          <Container className="relative h-full">
            {/* Centered can — constrained so it never clips under the header */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                ref={canRef}
                className="flex justify-center"
              >
                <ProductCan
                  fitHeight
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

            {/* Stage copy — left, never overlapping the can center */}
            <div className="relative z-20 flex h-full max-w-[min(100%,22rem)] items-center xl:max-w-md">
              <div className="relative w-full min-h-[12rem]">
                {productStoryStages.map((stage, index) => (
                  <div
                    key={stage.id}
                    data-stage-desktop
                    className={cn(
                      "absolute inset-x-0 top-1/2 w-full -translate-y-1/2",
                      index === 0 ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <StageCopy
                      index={index}
                      label={stage.label}
                      text={stage.text}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Mobile + reduced motion */}
      <div className={cn("md:hidden", prefersReducedMotion && "md:block")}>
        <div>
          {productStoryStages.map((stage, index) => (
            <div
              key={stage.id}
              className={cn("section-pad", toneClasses[stage.tone])}
            >
              <Container>
                <div className="mx-auto flex max-w-md flex-col items-center gap-8 text-center">
                  <div className="w-full">
                    <StageCopy
                      index={index}
                      label={stage.label}
                      text={stage.text}
                    />
                  </div>
                  <div className="w-full max-w-[200px]">
                    <ProductCan
                      className="max-w-none"
                      tone={
                        stage.tone === "ice" || stage.tone === "lime-soft"
                          ? "ice"
                          : "navy"
                      }
                      showReflection={index === productStoryStages.length - 1}
                    />
                  </div>
                </div>
              </Container>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
