"use client";

import { cn } from "@/lib/cn";

type AuroraFieldProps = {
  className?: string;
  /** Brand-derived palette. Never purple-generic. */
  tone?: "navy" | "water" | "deep";
  /** When false, renders a static attractive composition (reduced motion). */
  animated?: boolean;
  intensity?: "soft" | "medium";
};

/**
 * GPU-friendly aurora: layered CSS gradients + slow transforms.
 * Brand tones only (navy / cyan / lime). No purple template look.
 */
export function AuroraField({
  className,
  tone = "navy",
  animated = true,
  intensity = "medium",
}: AuroraFieldProps) {
  const soft = intensity === "soft";

  return (
    <div
      aria-hidden
      data-aurora-field
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        tone === "navy" && "bg-pw-navy-deep",
        tone === "water" && "bg-pw-water",
        tone === "deep" && "bg-pw-navy-deep",
        className,
      )}
    >
      {/* Base wash */}
      <div
        className={cn(
          "absolute inset-0",
          soft
            ? "bg-[radial-gradient(ellipse_at_30%_20%,rgba(0,169,203,0.22),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(183,243,51,0.1),transparent_50%)]"
            : "bg-[radial-gradient(ellipse_at_25%_15%,rgba(0,169,203,0.32),transparent_52%),radial-gradient(ellipse_at_75%_80%,rgba(183,243,51,0.14),transparent_48%),radial-gradient(ellipse_at_50%_50%,rgba(7,26,56,0.4),transparent_70%)]",
        )}
      />

      {/* Slow drifting layers — transform only */}
      <div
        data-aurora-layer="a"
        className={cn(
          "absolute -left-[20%] -top-[30%] h-[70%] w-[70%] rounded-full",
          "bg-[radial-gradient(circle,rgba(0,169,203,0.35),transparent_68%)]",
          "blur-3xl will-change-transform",
          animated && "animate-aurora-drift-a",
        )}
      />
      <div
        data-aurora-layer="b"
        className={cn(
          "absolute -bottom-[25%] -right-[15%] h-[65%] w-[65%] rounded-full",
          "bg-[radial-gradient(circle,rgba(183,243,51,0.18),transparent_70%)]",
          "blur-3xl will-change-transform",
          animated && "animate-aurora-drift-b",
        )}
      />
      <div
        data-aurora-layer="c"
        className={cn(
          "absolute left-[35%] top-[40%] h-[45%] w-[45%] -translate-x-1/2 -translate-y-1/2 rounded-full",
          "bg-[radial-gradient(circle,rgba(10,111,143,0.28),transparent_65%)]",
          "blur-3xl will-change-transform",
          animated && "animate-aurora-drift-c",
        )}
      />

      {/* Fine grain veil */}
      <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay grain" />
    </div>
  );
}
