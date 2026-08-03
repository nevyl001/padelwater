"use client";

import { cn } from "@/lib/cn";

/**
 * Single-pass specular highlight. Triggered via GSAP class or data attribute.
 */
export function ProductHighlight({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      data-product-highlight
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[40%/8%]",
        className,
      )}
    >
      <div
        data-highlight-sheen
        className="absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0"
      />
    </div>
  );
}
