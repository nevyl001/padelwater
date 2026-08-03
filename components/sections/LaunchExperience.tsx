"use client";

import { useEffect, useRef, useState } from "react";
import { heroContent, productStoryStages } from "@/data/site-content";
import { product } from "@/data/product";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { DotPattern } from "@/components/ui/DotPattern";
import { Container } from "@/components/ui/Container";
import { ProductCanStage } from "@/components/product/ProductCanStage";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
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

const STORY_VH = 360;

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

  const [activeStage, setActiveStage] = useState(0);
  const [conductorOn, setConductorOn] = useState(false);

  const canUseConductor = ready && !prefersReducedMotion && !isMobile;
  const showDesktopPin = canUseConductor;
  const hideInlineCan = canUseConductor && conductorOn;

  const tone = productStoryStages[activeStage]?.tone ?? "navy";
  const canTone =
    tone === "lime-soft" ? "ice" : tone === "water" ? "water" : "navy";

  useEffect(() => {
    if (!canUseConductor) return;

    const root = rootRef.current;
    const hero = heroRef.current;
    const story = storyRef.current;
    const pin = pinRef.current;
    const anchor = heroAnchorRef.current;
    const stage = stageRef.current;
    const copy = heroCopyRef.current;
    if (!root || !hero || !story || !pin || !anchor || !stage || !copy) return;

    const pinEl = pin;
    const stageEl = stage;
    const anchorEl = anchor;
    const copyEl = copy;
    const heroEl = hero;
    const storyEl = story;
    const rootEl = root;

    let dead = false;
    let revert: (() => void) | undefined;
    let offPointer: (() => void) | undefined;

    async function boot() {
      const { getGsap } = await import("@/lib/animation/gsap");
      const { gsap, ScrollTrigger } = getGsap();
      if (dead) return;

      const snapToAnchor = () => {
        const r = anchorEl.getBoundingClientRect();
        gsap.set(stageEl, {
          x: r.left + r.width / 2,
          y: r.top + r.height / 2,
          xPercent: -50,
          yPercent: -50,
          scale: 1,
          opacity: 1,
        });
      };

      snapToAnchor();
      setConductorOn(true);

      const ctx = gsap.context(() => {
        const lines = copyEl.querySelectorAll("[data-hero-line]");
        const late = copyEl.querySelectorAll("[data-hero-late]");
        const eyebrow = copyEl.querySelector("[data-hero-eyebrow]");
        const dots = heroEl.querySelector("[data-hero-dots]");
        const sheen = stageEl.querySelector("[data-highlight-sheen]");
        const reflection = stageEl.querySelector("[data-product-reflection]");
        const stages = gsap.utils.toArray<HTMLElement>(
          pinEl.querySelectorAll("[data-story-stage]"),
        );
        const holdHint = pinEl.querySelector("[data-hold-hint]");

        if (layer === "fullMotion") {
          gsap.set([eyebrow, ...Array.from(late)], { opacity: 0, y: 16 });
          gsap.set(lines, { yPercent: 105, opacity: 0 });
          if (dots) gsap.set(dots, { opacity: 0 });
          if (reflection) gsap.set(reflection, { opacity: 0 });
          gsap.set(stageEl, { scale: 0.9 });

          const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
          if (dots) intro.to(dots, { opacity: 0.65, duration: 0.4 }, 0);
          intro
            .to(stageEl, { scale: 1, duration: 0.8 }, 0.05)
            .to(reflection, { opacity: 1, duration: 0.3 }, 0.5)
            .to(eyebrow, { opacity: 1, y: 0, duration: 0.35 }, 0.4)
            .to(
              lines,
              { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.07 },
              0.5,
            )
            .to(
              late,
              { opacity: 1, y: 0, duration: 0.35, stagger: 0.05 },
              0.9,
            );
          if (sheen) {
            intro.fromTo(
              sheen,
              { x: "-130%", opacity: 0 },
              { x: "230%", opacity: 1, duration: 0.65, ease: "power2.inOut" },
              0.65,
            );
          }
        }

        let live = true;
        const base = { x: 0, y: 0 };
        const qx = gsap.quickTo(stageEl, "x", {
          duration: 0.55,
          ease: "power3",
        });
        const qy = gsap.quickTo(stageEl, "y", {
          duration: 0.55,
          ease: "power3",
        });
        const refreshBase = () => {
          const r = anchorEl.getBoundingClientRect();
          base.x = r.left + r.width / 2;
          base.y = r.top + r.height / 2;
        };
        refreshBase();

        const onMove = (e: PointerEvent) => {
          if (!live) return;
          const hr = heroEl.getBoundingClientRect();
          if (e.clientY < hr.top || e.clientY > hr.bottom) return;
          const px = (e.clientX - hr.left) / hr.width - 0.5;
          const py = (e.clientY - hr.top) / hr.height - 0.5;
          qx(base.x + px * 12);
          qy(base.y + py * 9);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        offPointer = () => window.removeEventListener("pointermove", onMove);

        gsap.set(stages, { autoAlpha: 0, y: 24 });
        if (stages[0]) gsap.set(stages[0], { autoAlpha: 1, y: 0 });
        if (holdHint) gsap.set(holdHint, { autoAlpha: 0 });

        const pinCenter = () => {
          const r = pinEl.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height * 0.52 };
        };

        ScrollTrigger.create({
          trigger: storyEl,
          start: "top top",
          end: () => `+=${STORY_VH * (window.innerHeight / 100)}`,
          pin: pinEl,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootEl,
            start: "top top",
            end: () =>
              `+=${window.innerHeight + STORY_VH * (window.innerHeight / 100)}`,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const heroEnd = window.innerHeight / (self.end - self.start);
              live = self.progress < heroEnd * 0.75;
              if (live) refreshBase();
            },
          },
        });

        tl.to(copyEl, { opacity: 0, y: -20, ease: "none", duration: 1 }, 0);
        tl.to(
          stageEl,
          {
            x: () => pinCenter().x,
            y: () => pinCenter().y,
            scale: 1.04,
            ease: "none",
            duration: 1.2,
          },
          0.15,
        );
        tl.call(() => setActiveStage(0), undefined, 1.0);

        const s1 = 1.7;
        tl.to(
          stages[0],
          { autoAlpha: 0, y: -18, ease: "none", duration: 0.35 },
          s1,
        );
        tl.fromTo(
          stages[1],
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, ease: "none", duration: 0.4 },
          s1 + 0.1,
        );
        tl.to(
          stageEl,
          {
            x: () => pinCenter().x - 72,
            scale: 1,
            ease: "none",
            duration: 0.5,
          },
          s1,
        );
        tl.call(() => setActiveStage(1), undefined, s1 + 0.15);
        tl.to({}, { duration: 0.7 }, s1 + 0.5);

        const s2 = s1 + 1.2;
        tl.to(
          stages[1],
          { autoAlpha: 0, y: -18, ease: "none", duration: 0.35 },
          s2,
        );
        tl.fromTo(
          stages[2],
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, ease: "none", duration: 0.4 },
          s2 + 0.1,
        );
        tl.to(
          stageEl,
          {
            x: () => pinCenter().x + 36,
            scale: 1.07,
            ease: "none",
            duration: 0.5,
          },
          s2,
        );
        tl.call(() => setActiveStage(2), undefined, s2 + 0.15);
        tl.to({}, { duration: 0.7 }, s2 + 0.5);

        const s3 = s2 + 1.2;
        tl.to(
          stages[2],
          { autoAlpha: 0, y: -18, ease: "none", duration: 0.35 },
          s3,
        );
        tl.fromTo(
          stages[3],
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, ease: "none", duration: 0.45 },
          s3 + 0.1,
        );
        tl.to(
          stageEl,
          {
            x: () => pinCenter().x,
            scale: 1.02,
            ease: "none",
            duration: 0.5,
          },
          s3,
        );
        tl.call(() => setActiveStage(3), undefined, s3 + 0.15);
        tl.to({}, { duration: 0.75 }, s3 + 0.55);

        const hold = s3 + 1.3;
        if (holdHint) {
          tl.to(
            holdHint,
            { autoAlpha: 0.65, ease: "none", duration: 0.35 },
            hold,
          );
        }
        tl.to(
          pinEl.querySelector("[data-story-backdrop]"),
          { backgroundColor: "#cfe8c4", ease: "none", duration: 0.45 },
          hold,
        );
        tl.to({}, { duration: 0.6 }, hold + 0.25);
      }, rootEl);

      revert = () => {
        ctx.revert();
        ScrollTrigger.getAll().forEach((t) => {
          if (
            t.trigger === rootEl ||
            t.trigger === storyEl ||
            t.trigger === heroEl
          ) {
            t.kill();
          }
        });
      };

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    void boot();
    return () => {
      dead = true;
      offPointer?.();
      revert?.();
      setConductorOn(false);
    };
  }, [canUseConductor, layer]);

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
        style={showDesktopPin ? { height: `${STORY_VH}vh` } : undefined}
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
