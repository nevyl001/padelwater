"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { prefersReducedMotion, ready } = useMotionPreferences();

  useEffect(() => {
    if (!ready || prefersReducedMotion) return;

    let lenis: Lenis | undefined;
    let cleanupGsap: (() => void) | undefined;

    async function setup() {
      const { getGsap } = await import("@/lib/gsap");
      const { gsap, ScrollTrigger } = getGsap();

      lenis = new Lenis({
        duration: 1.1,
        smoothWheel: true,
        touchMultiplier: 1.2,
      });

      document.documentElement.classList.add("lenis", "lenis-smooth");

      lenis.on("scroll", ScrollTrigger.update);

      const ticker = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      cleanupGsap = () => {
        gsap.ticker.remove(ticker);
        gsap.ticker.lagSmoothing(500, 33);
      };

      ScrollTrigger.refresh();
    }

    void setup();

    return () => {
      cleanupGsap?.();
      lenis?.destroy();
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, [ready, prefersReducedMotion]);

  return children;
}
