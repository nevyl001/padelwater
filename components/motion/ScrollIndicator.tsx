"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

type ScrollIndicatorProps = {
  label?: string;
  href?: string;
  className?: string;
};

/**
 * Idle scroll affordance. Decorative, not narrative — so it runs on
 * Motion's loop rather than being wired into a scene's GSAP timeline.
 */
export function ScrollIndicator({
  label = "Explora el producto",
  href,
  className,
}: ScrollIndicatorProps) {
  const { prefersReducedMotion } = useMotionPreferences();
  const Tag = href ? motion.a : motion.div;

  return (
    <Tag
      {...(href ? { href } : {})}
      className={cn(
        "group inline-flex flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.28em] text-white/45 transition-colors hover:text-white/80",
        className,
      )}
      animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
      transition={
        prefersReducedMotion
          ? undefined
          : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
      }
    >
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
