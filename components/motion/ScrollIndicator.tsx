"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

type ScrollIndicatorProps = {
  label?: string;
  href?: string;
  className?: string;
  /** Extra line + softer presence for cinematic heroes */
  reinforced?: boolean;
};

/**
 * Idle scroll affordance. Decorative — Motion loop, not GSAP narrative.
 */
export function ScrollIndicator({
  label = "Explora el producto",
  href,
  className,
  reinforced = false,
}: ScrollIndicatorProps) {
  const { prefersReducedMotion } = useMotionPreferences();
  const Tag = href ? motion.a : motion.div;

  return (
    <Tag
      {...(href ? { href } : {})}
      className={cn(
        "group inline-flex flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.28em] text-white/45 transition-colors hover:text-white/80",
        reinforced && "gap-3 text-white/55",
        className,
      )}
      animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
      transition={
        prefersReducedMotion
          ? undefined
          : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
      }
    >
      {reinforced ? (
        <span
          aria-hidden
          className={cn(
            "mb-1 h-10 w-px bg-gradient-to-b from-transparent via-pw-lime/70 to-pw-cyan/50",
            !prefersReducedMotion && "animate-scroll-line",
          )}
        />
      ) : null}
      <span>{label}</span>
      <svg
        aria-hidden
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="opacity-70"
      >
        <path
          d="M2 5L7 10L12 5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Tag>
  );
}
