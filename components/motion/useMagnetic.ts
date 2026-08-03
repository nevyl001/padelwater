"use client";

import { useMotionValue, useSpring } from "motion/react";
import { useCallback, useRef } from "react";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

type UseMagneticOptions = {
  enabled?: boolean;
  pull?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
};

/**
 * Shared magnetic-pull primitive. Motion only — GSAP drives scene
 * narrative, Motion drives UI micro-interaction, this is the latter.
 * Consumed by Button's `magnetic` prop and any future magnetic UI
 * element, so there is exactly one magnetic implementation.
 */
export function useMagnetic({
  enabled = true,
  pull = 0.18,
  stiffness = 280,
  damping = 22,
  mass = 0.4,
}: UseMagneticOptions = {}) {
  const { profile, layer } = useMotionPreferences();
  const active = enabled && profile.enableMagnetic && layer === "fullMotion";

  const nodeRef = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness, damping, mass });
  const springY = useSpring(y, { stiffness, damping, mass });

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!active) return;
      const node = nodeRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      x.set((e.clientX - (rect.left + rect.width / 2)) * pull);
      y.set((e.clientY - (rect.top + rect.height / 2)) * pull);
    },
    [active, pull, x, y],
  );

  const onMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return {
    ref: nodeRef,
    active,
    style: active ? { x: springX, y: springY } : undefined,
    onMouseMove,
    onMouseLeave,
  };
}
