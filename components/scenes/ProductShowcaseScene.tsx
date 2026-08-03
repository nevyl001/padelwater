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
import { distances, durations, easings } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Immersive product stage — the site's star piece.
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
      curX += (targetX - curX) * 0.065;
      curY += (targetY - curY) * 0.065;
      root.style.setProperty("--px", `${(curX * 100).toFixed(2)}%`);
      root.style.setProperty("--py", `${(curY * 100).toFixed(2)}%`);
      glow.style.transform = `translate3d(${((curX - 0.5) * 28).toFixed(2)}px, ${((curY - 0.5) * 18).toFixed(2)}px, 0)`;
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
        if (running) {
          glow.style.willChange = "transform";
          if (can) can.style.willChange = "transform";
          raf = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(raf);
          glow.style.willChange = "auto";
          if (can) can.style.willChange = "auto";
        }
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
      glow.style.willChange = "auto";
      if (can) {
        can.style.transform = "";
        can.style.willChange = "auto";
      }
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
  const easeCss = `cubic-bezier(${easings.outExpo.join(",")})`;

  return (
    <section
      ref={rootRef}
      id="producto"
      data-scene="product-showcase"
      className="relative overflow-hidden text-pw-white anchor-offset"
      aria-label="El producto"
      style={
        {
          ["--px" as string]: "52%",
          ["--py" as string]: "46%",
        } as CSSProperties
      }
    >
      <AuroraField tone="deep" animated={animateAurora} intensity="medium" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 50% 42% at var(--px) var(--py), rgba(0,169,203,0.32), transparent 62%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          background:
            "radial-gradient(ellipse 36% 30% at calc(var(--px) + 6%) calc(var(--py) + 8%), rgba(183,243,51,0.14), transparent 58%)",
        }}
      />

      <Container className="relative z-10 py-8 md:py-24 lg:py-32">
        {/* Mobile: compact eyebrow only. Desktop: full brand header. */}
        <div className="mb-3 flex flex-col gap-1.5 text-center md:mb-14 md:gap-3 md:text-left">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-pw-lime md:text-[0.68rem]">
            Producto
          </p>
          <h2 className="sr-only md:not-sr-only md:block md:text-editorial md:text-pw-white">
            {product.name}
          </h2>
        </div>

        <div className="grid w-full min-w-0 items-center gap-4 md:gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 xl:gap-20">
          <div
            ref={panelRef}
            className={cn(
              "order-2 w-full min-w-0 lg:order-1",
              !prefersReducedMotion && "opacity-0",
            )}
          >
            <AttributePanel
              attribute={active}
              panelId={`${tablistId}-panel`}
              key={active.id}
              reduced={prefersReducedMotion}
            />

            <div
              role="tablist"
              aria-label="Características del producto"
              id={tablistId}
              className="mx-auto mt-5 flex w-full max-w-md flex-wrap justify-center gap-2 md:mx-0 md:mt-8 md:max-w-none md:justify-start lg:mt-10"
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
                      "rounded-sm border px-2.5 py-2 text-[0.55rem] uppercase tracking-[0.14em] transition-[color,background-color,border-color] duration-300 sm:px-3 sm:text-[0.58rem] sm:tracking-[0.16em] md:px-3.5 md:py-2.5 md:text-[0.62rem] md:tracking-[0.2em]",
                      selected
                        ? "border-pw-lime bg-pw-lime/12 text-pw-lime"
                        : "border-white/18 text-white/60 hover:border-white/40 hover:text-white/90",
                    )}
                  >
                    {attr.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex w-full justify-center md:mt-8 lg:mt-10 lg:justify-start">
              <Button
                variant="secondary"
                onClick={() => setInfoOpen(true)}
                className="w-full max-w-xs border-white/35 text-pw-white hover:border-white hover:bg-white/5 sm:w-auto sm:max-w-none"
              >
                Ver información del producto
              </Button>
            </div>
          </div>

          <div
            ref={stageRef}
            className={cn(
              "relative order-1 flex w-full min-w-0 items-center justify-center md:min-h-[min(68svh,540px)] lg:order-2",
              !prefersReducedMotion && "opacity-0",
            )}
          >
            <div
              ref={glowRef}
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[48%] h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,169,203,0.55),transparent_70%)] blur-2xl md:h-[58%] md:w-[58%]"
            />

            <OrbitalRings
              animated={!prefersReducedMotion && !isMobile}
              activeIndex={activeIndex}
            />

            <FloatingLabels attribute={active} />

            <div
              ref={canRef}
              className="relative z-10"
              style={{
                transition: prefersReducedMotion
                  ? undefined
                  : `filter ${durations.showcaseSwap}s ${easeCss}`,
              }}
            >
              <ProductCanStage
                mode="inline"
                tone={active.canTone}
                size="showcase"
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
  reduced,
}: {
  attribute: ShowcaseAttribute;
  panelId: string;
  reduced: boolean;
}) {
  return (
    <div
      role="tabpanel"
      id={panelId}
      className={cn(
        "mx-auto max-w-md text-center lg:mx-0 lg:max-w-none lg:text-left",
        !reduced && "animate-showcase-panel",
      )}
    >
      <p className="text-[0.68rem] uppercase tracking-[0.3em] text-pw-cyan">
        {attribute.eyebrow}
      </p>
      <h3 className="mt-3.5 font-display text-[clamp(1.85rem,3.5vw,2.75rem)] font-bold uppercase leading-[1.02] tracking-[-0.03em] text-pw-white">
        {attribute.title}
      </h3>
      <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-white/72 md:mt-5 md:text-lg lg:mx-0 lg:max-w-md">
        {attribute.text}
      </p>
    </div>
  );
}

function FloatingLabels({ attribute }: { attribute: ShowcaseAttribute }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 hidden md:block"
    >
      <span
        key={attribute.id}
        className="absolute left-[5%] top-[16%] text-[0.58rem] uppercase tracking-[0.32em] text-white/40 animate-showcase-panel"
      >
        {attribute.label}
      </span>
      {attribute.id === "formato" ? (
        <span className="absolute bottom-[20%] right-[7%] text-right text-[0.58rem] uppercase tracking-[0.24em] text-pw-cyan/55">
          {product.volume}
        </span>
      ) : null}
      <span className="absolute right-[9%] top-[26%] h-10 w-px bg-gradient-to-b from-pw-lime/55 to-transparent" />
      <span className="absolute bottom-[26%] left-[10%] h-px w-14 bg-gradient-to-r from-pw-cyan/45 to-transparent" />
    </div>
  );
}
