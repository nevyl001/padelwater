"use client";

import { cn } from "@/lib/cn";

type CourtFieldProps = {
  className?: string;
  tone?: "dark" | "light" | "water" | "lime";
  intensity?: "soft" | "medium";
  animated?: boolean;
};

const inkByTone = {
  dark: "text-white",
  light: "text-pw-navy",
  water: "text-white",
  lime: "text-pw-navy",
} as const;

const strokeByTone = {
  dark: "opacity-90",
  light: "opacity-80",
  water: "opacity-90",
  lime: "opacity-85",
} as const;

const glowByTone = {
  dark: "from-pw-cyan/20 via-transparent to-pw-lime/15",
  light: "from-pw-cyan/10 via-transparent to-pw-lime/20",
  water: "from-white/15 via-transparent to-pw-lime/20",
  lime: "from-pw-navy/10 via-transparent to-pw-cyan/15",
} as const;

/**
 * Atmospheric padel-court field — lines + perspective, not a literal diagram.
 * Pure SVG/CSS so it works without assets and respects reduced motion via `animated`.
 */
export function CourtField({
  className,
  tone = "dark",
  intensity = "medium",
  animated = true,
}: CourtFieldProps) {
  const stroke = strokeByTone[tone];
  const ink = inkByTone[tone];
  const opacity = intensity === "soft" ? "opacity-45" : "opacity-75";

  return (
    <div
      aria-hidden
      data-court-field
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br",
          glowByTone[tone],
        )}
      />

      <svg
        className={cn(
          "absolute inset-x-[-8%] bottom-[-18%] h-[78%] w-[116%]",
          ink,
          opacity,
          stroke,
          animated && "court-drift",
        )}
        viewBox="0 0 1200 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="courtFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="35%" stopColor="currentColor" stopOpacity="0.55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Perspective outer court */}
        <g
          stroke="url(#courtFade)"
          strokeWidth="2"
          className={animated ? "court-pulse" : undefined}
        >
          <path d="M140 660 L320 180 H880 L1060 660 Z" />
          <path d="M260 660 L380 180" />
          <path d="M940 660 L820 180" />
          <path d="M200 520 H1000" />
          <path d="M230 420 H970" />
          <path d="M280 300 H920" />
          {/* Service boxes */}
          <path d="M600 180 V520" />
          <path d="M380 300 V520" />
          <path d="M820 300 V520" />
          {/* Net suggestion */}
          <path d="M340 250 H860" strokeWidth="3" />
          <path d="M600 230 V270" strokeWidth="3" />
        </g>

        {/* Accent ticks — padel glass / fence rhythm */}
        <g strokeWidth="1.5" className="opacity-40" stroke="currentColor">
          {Array.from({ length: 11 }).map((_, i) => {
            const x = 320 + i * 56;
            return (
              <path
                key={x}
                d={`M${x} 175 L${x + (i - 5) * 8} 155`}
              />
            );
          })}
        </g>
      </svg>

      {/* Soft moving light across the glass */}
      {animated ? (
        <div className="court-sheen absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(183,243,51,0.07)_50%,transparent_60%)]" />
      ) : null}

      {/* Depth vignette — only on dark / water fields */}
      {(tone === "dark" || tone === "water") && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,transparent_20%,rgba(3,17,38,0.55)_80%)] mix-blend-multiply opacity-60" />
      )}
    </div>
  );
}
