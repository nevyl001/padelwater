"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

export function ScrollProgress({ className }: { className?: string }) {
  const [progress, setProgress] = useState(0);
  const { prefersReducedMotion } = useMotionPreferences();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent",
        className,
      )}
    >
      <div
        className="h-full origin-left bg-pw-lime transition-transform duration-75 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
