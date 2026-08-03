"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

type SplitTextRevealProps = {
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  as?: "h2" | "p" | "div";
};

export function SplitTextReveal({
  lines,
  className,
  lineClassName,
  as: Tag = "h2",
}: SplitTextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const { prefersReducedMotion } = useMotionPreferences();

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion) return;

    let ctx: { revert: () => void } | undefined;

    async function run() {
      const { getGsap } = await import("@/lib/gsap");
      const { gsap, ScrollTrigger } = getGsap();
      const lineEls = root!.querySelectorAll<HTMLElement>("[data-line]");

      ctx = gsap.context(() => {
        gsap.fromTo(
          lineEls,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: root,
              start: "top 78%",
              once: true,
            },
          },
        );
      }, root!);

      return () => {
        ScrollTrigger.getAll()
          .filter((t) => t.trigger === root)
          .forEach((t) => t.kill());
      };
    }

    let cleanup: (() => void) | undefined;
    run().then((c) => {
      cleanup = c;
    });

    return () => {
      ctx?.revert();
      cleanup?.();
    };
  }, [prefersReducedMotion]);

  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement>} className={cn(className)}>
      {lines.map((line) => (
        <span key={line} className="block overflow-hidden">
          <span
            data-line
            className={cn(
              "block",
              !prefersReducedMotion && "opacity-0",
              lineClassName,
            )}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
