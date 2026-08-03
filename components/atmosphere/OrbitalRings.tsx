"use client";

import { cn } from "@/lib/cn";

type OrbitalRingsProps = {
  className?: string;
  animated?: boolean;
  activeIndex?: number;
};

/**
 * Technical orbital frame around the can — slow CSS rotation only.
 * Active index subtly shifts dash/opacity to mark attribute focus.
 */
export function OrbitalRings({
  className,
  animated = true,
  activeIndex = 0,
}: OrbitalRingsProps) {
  const accent = activeIndex % 5;

  return (
    <div
      aria-hidden
      data-orbital-rings
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center",
        className,
      )}
    >
      <svg
        viewBox="0 0 400 400"
        className="h-[min(72vw,300px)] w-[min(72vw,300px)] overflow-visible md:h-[min(88vw,520px)] md:w-[min(88vw,520px)]"
      >
        <defs>
          <linearGradient id="orbit-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,169,203,0.55)" />
            <stop offset="100%" stopColor="rgba(0,169,203,0.05)" />
          </linearGradient>
          <linearGradient id="orbit-lime" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(183,243,51,0.45)" />
            <stop offset="100%" stopColor="rgba(183,243,51,0.04)" />
          </linearGradient>
        </defs>

        {/* Outer technical ring */}
        <g
          className={cn(animated && "origin-center animate-orbit-slow")}
          style={{ transformOrigin: "200px 200px" }}
        >
          <circle
            cx="200"
            cy="200"
            r="178"
            fill="none"
            stroke="url(#orbit-cyan)"
            strokeWidth="1"
            strokeDasharray="4 10"
            opacity={0.55 + (accent === 0 ? 0.25 : 0)}
          />
          <circle cx="200" cy="22" r="3" fill="rgba(183,243,51,0.9)" />
          <circle cx="378" cy="200" r="2" fill="rgba(0,169,203,0.8)" />
        </g>

        {/* Mid orbit */}
        <g
          className={cn(animated && "origin-center animate-orbit-reverse")}
          style={{ transformOrigin: "200px 200px" }}
        >
          <circle
            cx="200"
            cy="200"
            r="132"
            fill="none"
            stroke="url(#orbit-lime)"
            strokeWidth="1.25"
            strokeDasharray="2 8"
            opacity={0.5 + (accent === 2 ? 0.3 : 0)}
          />
          <circle cx="68" cy="200" r="2.5" fill="rgba(255,255,255,0.55)" />
        </g>

        {/* Inner solid guide */}
        <circle
          cx="200"
          cy="200"
          r="96"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          opacity={0.7 + (accent === 3 ? 0.2 : 0)}
        />

        {/* Crosshair ticks */}
        <g stroke="rgba(255,255,255,0.2)" strokeWidth="1">
          <line x1="200" y1="48" x2="200" y2="62" />
          <line x1="200" y1="338" x2="200" y2="352" />
          <line x1="48" y1="200" x2="62" y2="200" />
          <line x1="338" y1="200" x2="352" y2="200" />
        </g>
      </svg>
    </div>
  );
}
