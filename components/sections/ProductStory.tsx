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
      <h2 className="mt-3 text-editorial">{label}</h2>
      <p className="mt-4 text-base leading-relaxed opacity-80 md:mt-5 md:text-body-lg">
        {text}
      </p>
    </>
  );
}

export function ProductStory() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canRef = useRef<HTMLDivElement>(null);
  const { profile, prefersReducedMotion, ready } = useMotionPreferences();
  const [active, setActive] = useState(0);
  const [desktopStory, setDesktopStory] = useState(false);

  const currentTone = productStoryStages[active]?.tone ?? "navy";

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

        const positions = [
          { xPercent: 0, scale: 1 },
          { xPercent: -6, scale: 1.04 },
          { xPercent: 6, scale: 0.98 },
          { xPercent: 0, scale: 1.06 },
        ];

        const texts = gsap.utils.toArray<HTMLElement>(
          root!.querySelectorAll("[data-stage-desktop]"),
        );

        gsap.set(can, {
          xPercent: positions[0].xPercent,
          scale: positions[0].scale,
        });
        gsap.set(texts, { opacity: 0, y: 24 });
        if (texts[0]) gsap.set(texts[0], { opacity: 1, y: 0 });

        const stageCount = productStoryStages.length;

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
          const pos = positions[i];
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
          setDesktopStory(false);
          setActive(0);
          gsap.set(can, { clearProps: "transform" });
        };
      });

      mm.add("(max-width: 767px)", () => {
        setDesktopStory(false);
        setActive(0);
        gsap.set(can, { clearProps: "transform" });
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
  }, [prefersReducedMotion, profile.storyVh, ready]);

  return (
    <section
      ref={rootRef}
      id="producto"
      className="relative anchor-offset"
      aria-label="Experiencia de producto"
      style={
        desktopStory && !prefersReducedMotion
          ? { height: `${profile.storyVh}vh` }
          : undefined
      }
    >
      {/* Desktop sticky story */}
      <div
        ref={pinRef}
        className={cn(
          "relative hidden overflow-hidden transition-colors duration-500 md:flex md:min-h-[100svh] md:items-center",
          prefersReducedMotion && "md:hidden",
          toneClasses[currentTone],
        )}
      >
        <Container className="relative z-10 w-full">
          <div className="relative flex min-h-[28rem] items-center justify-center">
            <div className="absolute left-0 top-1/2 z-20 w-full max-w-sm -translate-y-1/2 text-left xl:max-w-md">
              <div className="relative min-h-[14rem]">
                {productStoryStages.map((stage, index) => (
                  <div
                    key={stage.id}
                    data-stage-desktop
                    className="absolute inset-x-0 top-0"
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

            <div className="relative z-10 flex w-full justify-center">
              <div
                ref={canRef}
                className="w-full max-w-[260px]"
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

      {/* Mobile + reduced motion: vertical stack, no pin, nothing clipped */}
      <div
        className={cn(
          "md:hidden",
          prefersReducedMotion && "md:block",
        )}
      >
        <div className="space-y-0">
          {productStoryStages.map((stage, index) => (
            <div
              key={stage.id}
              className={cn(
                "section-pad",
                toneClasses[stage.tone],
              )}
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
