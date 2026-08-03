"use client";

/**
 * Lenis disabled for launch-sequence phase.
 * Re-enable only after A/B vs native scroll proves a clear win on desktop.
 * Mobile default remains native forever per motion brief.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
