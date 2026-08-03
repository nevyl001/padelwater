"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import {
  showcaseAttributes,
  type ShowcaseAttribute,
} from "@/data/showcase-attributes";
import { product } from "@/data/product";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductCanStage } from "@/components/product/ProductCanStage";
import { ProductInformationPanel } from "@/components/product/ProductInformationPanel";
import { AuroraField } from "@/components/atmosphere/AuroraField";
import { OrbitalRings } from "@/components/atmosphere/OrbitalRings";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { useProductShowcaseSceneTimeline } from "@/components/scenes/useProductShowcaseSceneTimeline";
import { distances, durations } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Immersive interactive showcase — product as protagonist with orbital
 * frame, pointer lighting (refs/rAF), and real attribute states only.
 * Can swap ProductCanStage asset later without rewriting this scene.
 */
export function ProductShowcaseScene() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [activeId, setActiveId] = useState<ShowcaseAttribute["id"]>(
    showcaseAttributes[0].id,
  );
  const activeIndex = showcaseAttributes.findIndex((a) => a.id === activeId);
  const active = showcaseAttributes[activeIndex] ?? showcaseAttributes[0];

  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const tablistId = useId();

  const { ready, prefersReducedMotion, profile, isMobile } = useMotionPreferences();
  const enablePointer = profile.enablePointerShowcase && !prefersReducedMotion;

  useProductShowcaseSceneTimeline(
    { rootRef, stageRef, canRef, panelRef },
    { ready, prefersReducedMotion },
  );

  // Pointer ambient light via CSS vars — never React state per frame
  useEffect(() => {
    if (!enablePointer) return;
    const root = rootRef.current;
    const glow = glowRef.current;
    const can = canRef.current;
    if (!root || !glow) return;

    let raf = 0;
    let targetX = 0.5;
    let targetY = 0.45;
    let curX = 0.5;
    let curY = 0.45;
    let running = true;

    const tick = () => {
      if (!running) return;
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      root.style.setProperty("--px", `${(curX * 100).toFixed(2)}%`);
      root.style.setProperty("--py", `${(curY * 100).toFixed(2)}%`);
      glow.style.transform = `translate3d(${((curX - 0.5) * 40).toFixed(2)}px, ${((curY - 0.5) * 28).toFixed(2)}px, 0)`;
      if (can) {
        const dx = (curX - 0.5) * distances.showcasePointerX;
        const dy = (curY - 0.5) * distances.showcasePointerY;
        can.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;
      targetX = (e.clientX - rect.left) / rect.width;
      targetY = (e.clientY - rect.top) / rect.height;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) raf = requestAnimationFrame(tick);
        else cancelAnimationFrame(raf);
      },
      { threshold: 0.05 },
    );
    io.observe(root);
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      if (can) can.style.transform = "";
    };
  }, [enablePointer]);

  const selectByIndex = useCallback((index: number) => {
    const next = showcaseAttributes[index];
    if (next) setActiveId(next.id);
  }, []);

  const onTabKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      selectByIndex((index + 1) % showcaseAttributes.length);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      selectByIndex((index - 1 + showcaseAttributes.length) % showcaseAttributes.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      selectByIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      selectByIndex(showcaseAttributes.length - 1);
    }
  };

  // Touch swipe between attributes
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let startX = 0;
    const onStart = (e: TouchEvent) => {
      startX = e.changedTouches[0]?.clientX ?? 0;
    };
    const onEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0]?.clientX ?? 0;
      const delta = endX - startX;
      if (Math.abs(delta) < 48) return;
      if (delta < 0) selectByIndex((activeIndex + 1) % showcaseAttributes.length);
      else selectByIndex((activeIndex - 1 + showcaseAttributes.length) % showcaseAttributes.length);
    };
    stage.addEventListener("touchstart", onStart, { passive: true });
    stage.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      stage.removeEventListener("touchstart", onStart);
      stage.removeEventListener("touchend", onEnd);
    };
  }, [activeIndex, selectByIndex]);

  const animateAurora = ready && profile.enableAurora && !prefersReducedMotion;

  return (
    <section
      ref={rootRef}
      id="producto"
      data-scene="product-showcase"
      className="relative overflow-hidden text-pw-white anchor-offset"
      aria-label="El producto"
      style={
        {
          ["--px" as string]: "50%",
          ["--py" as string]: "45%",
        } as CSSProperties
      }
    >
      <AuroraField tone="deep" animated={animateAurora} intensity="medium" />

      {/* Pointer-reactive wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80 transition-[opacity] duration-500"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at var(--px) var(--py), rgba(0,169,203,0.28), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 40% 35% at calc(var(--px) + 8%) calc(var(--py) + 10%), rgba(183,243,51,0.12), transparent 55%)",
        }}
      />

      <Container className="relative z-10 py-16 md:py-24 lg:py-28">
        <div className="mb-8 flex flex-col gap-3 text-center md:mb-12 md:text-left">
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-pw-lime/85">
            Producto
          </p>
          <h2 className="text-editorial text-pw-white">{product.name}</h2>
          <p className="mx-auto max-w-lg text-white/60 md:mx-0">
            Características del producto, tal como las confirma el empaque.
          </p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:gap-16">
          {/* Editorial detail panel */}
          <div
            ref={panelRef}
            className={cn(
              "order-2 lg:order-1",
              !prefersReducedMotion && "opacity-0",
            )}
          >
            <AttributePanel
              attribute={active}
              panelId={`${tablistId}-panel`}
              key={active.id}
            />

            <div
              role="tablist"
              aria-label="Características del producto"
              id={tablistId}
              className="mt-8 flex flex-wrap gap-2 justify-center lg:justify-start"
            >
              {showcaseAttributes.map((attr, index) => {
                const selected = attr.id === activeId;
                return (
                  <button
                    key={attr.id}
                    type="button"
                    role="tab"
                    id={`${tablistId}-${attr.id}`}
                    aria-controls={`${tablistId}-panel`}
                    aria-selected={selected}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveId(attr.id)}
                    onKeyDown={(e) => onTabKeyDown(e, index)}
                    className={cn(
                      "rounded-sm border px-3 py-2 text-[0.65rem] uppercase tracking-[0.18em] transition-colors duration-300",
                      selected
                        ? "border-pw-lime bg-pw-lime/15 text-pw-lime"
                        : "border-white/15 text-white/55 hover:border-white/35 hover:text-white/85",
                    )}
                  >
                    {attr.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-center lg:justify-start">
              <Button
                variant="secondary"
                onClick={() => setInfoOpen(true)}
                className="border-white/30 text-pw-white hover:border-white hover:bg-white/5"
              >
                Ver información del producto
              </Button>
            </div>
          </div>

          {/* Immersive stage */}
          <div
            ref={stageRef}
            className={cn(
              "relative order-1 flex min-h-[min(70svh,520px)] items-center justify-center lg:order-2",
              !prefersReducedMotion && "opacity-0",
            )}
          >
            <div
              ref={glowRef}
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,169,203,0.45),transparent_68%)] blur-2xl will-change-transform"
            />

            <OrbitalRings
              animated={!prefersReducedMotion && !isMobile}
              activeIndex={activeIndex}
            />

            {/* Editorial floating labels around the can */}
            <FloatingLabels attribute={active} />

            <div
              ref={canRef}
              className="relative z-10 will-change-transform"
              style={{
                transition: prefersReducedMotion
                  ? undefined
                  : `opacity ${durations.showcaseSwap}s ease`,
              }}
            >
              <ProductCanStage
                mode="inline"
                tone={active.canTone}
                size="hero"
                quiet
              />
            </div>
          </div>
        </div>
      </Container>

      <ProductInformationPanel open={infoOpen} onClose={() => setInfoOpen(false)} />
    </section>
  );
}

function AttributePanel({
  attribute,
  panelId,
}: {
  attribute: ShowcaseAttribute;
  panelId: string;
}) {
  return (
    <div
      role="tabpanel"
      id={panelId}
      className="mx-auto max-w-md text-center lg:mx-0 lg:text-left"
    >
      <p className="text-[0.7rem] uppercase tracking-[0.28em] text-pw-cyan">
        {attribute.eyebrow}
      </p>
      <h3 className="mt-3 font-display text-3xl font-bold uppercase tracking-[-0.02em] text-pw-white md:text-4xl">
        {attribute.title}
      </h3>
      <p className="mt-4 text-lg text-white/70">{attribute.text}</p>
    </div>
  );
}

function FloatingLabels({ attribute }: { attribute: ShowcaseAttribute }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20 hidden md:block">
      <span className="absolute left-[6%] top-[18%] text-[0.6rem] uppercase tracking-[0.3em] text-white/35">
        {attribute.label}
      </span>
      {attribute.id === "formato" ? (
        <span className="absolute bottom-[22%] right-[8%] max-w-[9rem] text-right text-[0.6rem] uppercase tracking-[0.22em] text-pw-cyan/50">
          {product.volume}
        </span>
      ) : null}
      <span className="absolute right-[10%] top-[28%] h-8 w-px bg-gradient-to-b from-pw-lime/60 to-transparent" />
      <span className="absolute left-[12%] bottom-[28%] h-px w-12 bg-gradient-to-r from-pw-cyan/50 to-transparent" />
    </div>
  );
}
