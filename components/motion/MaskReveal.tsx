"use client";

import { forwardRef, useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

export type MaskSplit = "lines" | "words" | "chars" | "block";

export type MaskRevealProps = {
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3";
  className?: string;
  unitClassName?: string;
  stagger?: number;
  duration?: number;
  delay?: number;
  start?: string;
  /**
   * "auto": reveals itself once scrolled into view — for standalone
   * copy blocks (claims, section titles, footer statement).
   * "manual": stays hidden and exposes [data-mask-unit] nodes for a
   * parent scene's own GSAP timeline to animate in sync with the rest
   * of the scene (e.g. HeroScene sequencing eyebrow → title → CTA).
   */
  mode?: "auto" | "manual";
  splitBy?: MaskSplit;
  /** Author-broken lines — this codebase's copy already ships pre-broken
   * lines (see `heroContent.titleLines`), so no runtime line-measurement
   * is needed. */
  lines?: readonly string[];
  text?: string;
  /** Used with splitBy="block": reveals arbitrary content as one mask,
   * not just text — a pill, a CTA row, anything that should rise as a
   * single unit through the same mask technique. */
  children?: ReactNode;
};

const UNIT_DEFAULTS: Record<MaskSplit, { duration: number; stagger: number }> = {
  lines: { duration: 0.7, stagger: 0.09 },
  words: { duration: 0.5, stagger: 0.028 },
  chars: { duration: 0.4, stagger: 0.015 },
  block: { duration: 0.6, stagger: 0 },
};

function resolveSplit(props: MaskRevealProps): MaskSplit {
  if (props.splitBy) return props.splitBy;
  if (props.lines) return "lines";
  if (props.children) return "block";
  return "words";
}

function resolveParts(split: MaskSplit, props: MaskRevealProps): string[] {
  if (split === "lines") return [...(props.lines ?? [])];
  if (split === "chars") return Array.from(props.text ?? "");
  if (split === "words") return (props.text ?? "").split(/\s+/).filter(Boolean);
  return [];
}

/**
 * The single reveal engine for the whole site: an overflow-hidden mask
 * with a translated inner unit, GSAP-driven. Every text and block
 * reveal (hero, titles, claims, CTA, final) composes this one
 * primitive instead of hand-rolling a new reveal per section.
 */
export const MaskReveal = forwardRef<HTMLElement, MaskRevealProps>(function MaskReveal(
  props,
  forwardedRef,
) {
  const {
    as: Tag = "span",
    className,
    unitClassName,
    stagger,
    duration,
    delay = 0,
    mode = "auto",
    start = "top 80%",
    children,
  } = props;

  const localRef = useRef<HTMLElement | null>(null);
  const { prefersReducedMotion } = useMotionPreferences();
  const split = resolveSplit(props);
  const parts = resolveParts(split, props);
  const defaults = UNIT_DEFAULTS[split];
  const accessibleLabel =
    split === "chars" ? parts.join("") : parts.join(" ");

  useEffect(() => {
    if (mode !== "auto" || prefersReducedMotion) return;
    const root = localRef.current;
    if (!root) return;

    let dead = false;
    let revert: (() => void) | undefined;

    async function run() {
      const { getGsap } = await import("@/lib/animation/gsap");
      const { gsap, ScrollTrigger } = getGsap();
      if (dead || !root) return;
      const units = root.querySelectorAll("[data-mask-unit]");

      const ctx = gsap.context(() => {
        gsap.fromTo(
          units,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: duration ?? defaults.duration,
            delay,
            stagger: stagger ?? defaults.stagger,
            ease: "expo.out",
            scrollTrigger: { trigger: root, start, once: true },
          },
        );
      }, root);

      revert = () => {
        ctx.revert();
        ScrollTrigger.getAll()
          .filter((t) => t.trigger === root)
          .forEach((t) => t.kill());
      };
    }

    run();
    return () => {
      dead = true;
      revert?.();
    };
  }, [mode, prefersReducedMotion, start, delay, stagger, duration, defaults.duration, defaults.stagger]);

  const setRef = (node: HTMLElement | null) => {
    localRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  if (prefersReducedMotion) {
    return (
      <Tag ref={setRef as never} className={className}>
        {split === "lines"
          ? parts.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))
          : split === "block"
            ? children
            : accessibleLabel}
      </Tag>
    );
  }

  // Opacity only — no pre-set transform. GSAP's yPercent parses any
  // existing inline `transform` once and keeps it as a separate fixed
  // baseline instead of folding it into the property it animates, so a
  // pre-set `translateY(110%)` would survive as a permanent offset even
  // after GSAP tweens yPercent to 0. GSAP itself sets the hidden
  // position (see the fromTo "from" values below / in the caller's
  // gsap.set), and opacity:0 alone is enough to prevent a pre-JS flash.
  const hiddenUnitStyle: React.CSSProperties = {
    opacity: 0,
  };

  if (split === "block") {
    return (
      <Tag
        ref={setRef as never}
        className={cn("block overflow-hidden", className)}
        data-mask-root
      >
        <span
          data-mask-unit
          style={hiddenUnitStyle}
          className={cn("block will-change-transform [backface-visibility:hidden]", unitClassName)}
        >
          {children}
        </span>
      </Tag>
    );
  }

  return (
    <Tag
      ref={setRef as never}
      aria-label={accessibleLabel}
      className={cn("block", className)}
      data-mask-root
    >
      {parts.map((part, index) => (
        <span
          key={index}
          aria-hidden
          className={cn(
            split === "lines" ? "block overflow-hidden" : "inline-block overflow-hidden",
            split === "words" && index < parts.length - 1 && "mr-[0.25em]",
          )}
        >
          <span
            data-mask-unit
            style={hiddenUnitStyle}
            className={cn("block will-change-transform [backface-visibility:hidden]", unitClassName)}
          >
            {split === "chars" && part === " " ? " " : part}
          </span>
        </span>
      ))}
    </Tag>
  );
});
