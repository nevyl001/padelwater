"use client";

import { cn } from "@/lib/cn";
import { product } from "@/data/product";

type CanSilhouetteProps = {
  className?: string;
  tone?: "navy" | "ice" | "water" | "lime";
  quiet?: boolean;
};

const tones = {
  navy: { body: "#0a2748", mid: "#123a66", edge: "#051628", ink: "#ffffff", mute: "rgba(255,255,255,0.55)" },
  ice: { body: "#f4faf8", mid: "#ffffff", edge: "#d5e6e2", ink: "#071A38", mute: "rgba(7,26,56,0.5)" },
  water: { body: "#087a9a", mid: "#0ea3c4", edge: "#045066", ink: "#ffffff", mute: "rgba(255,255,255,0.6)" },
  lime: { body: "#e8f6a8", mid: "#f4fbd0", edge: "#c5e86a", ink: "#071A38", mute: "rgba(7,26,56,0.5)" },
} as const;

/**
 * Editorial aluminum-can silhouette (not a rounded card).
 * Used until final product photography lands.
 */
export function ProductCanSilhouette({
  className,
  tone = "navy",
  quiet = false,
}: CanSilhouetteProps) {
  const t = tones[tone];
  const uid = `can-${tone}`;

  return (
    <div
      className={cn("relative mx-auto aspect-[2/5] w-full", className)}
      data-product-can-image
    >
      <svg
        viewBox="0 0 160 400"
        className="h-full w-full drop-shadow-[0_28px_50px_rgba(3,17,38,0.28)]"
        role="img"
        aria-label={`${product.name} ${product.flavorLabel}, ${product.volume}. Fotografía final pendiente.`}
      >
        <defs>
          <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={t.edge} />
            <stop offset="18%" stopColor={t.body} />
            <stop offset="42%" stopColor={t.mid} />
            <stop offset="58%" stopColor={t.mid} />
            <stop offset="82%" stopColor={t.body} />
            <stop offset="100%" stopColor={t.edge} />
          </linearGradient>
          <linearGradient id={`${uid}-lid`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d8f08a" />
            <stop offset="100%" stopColor="#b7f333" />
          </linearGradient>
          <linearGradient id={`${uid}-metal`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cfd8e3" />
            <stop offset="50%" stopColor="#9aa8b8" />
            <stop offset="100%" stopColor="#7a8796" />
          </linearGradient>
          <radialGradient id={`${uid}-shine`} cx="32%" cy="28%" r="55%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* Soft ground contact */}
        <ellipse cx="80" cy="388" rx="46" ry="8" fill="rgba(3,17,38,0.18)" />

        {/* Can body — true cylinder silhouette */}
        <path
          d="M28 52
             C28 40 48 32 80 32
             C112 32 132 40 132 52
             L128 360
             C128 372 108 382 80 382
             C52 382 32 372 32 360
             Z"
          fill={`url(#${uid}-body)`}
        />

        {/* Top metal rim */}
        <ellipse cx="80" cy="52" rx="52" ry="14" fill={`url(#${uid}-metal)`} />
        {/* Lime top face */}
        <ellipse cx="80" cy="48" rx="46" ry="11" fill={`url(#${uid}-lid)`} />
        {/* Inner lid ring */}
        <ellipse
          cx="80"
          cy="48"
          rx="28"
          ry="6.5"
          fill="none"
          stroke="rgba(7,26,56,0.22)"
          strokeWidth="1.5"
        />
        {/* Pull-tab hint */}
        <path
          d="M72 44 H88"
          stroke="rgba(7,26,56,0.28)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="80" cy="44" r="2.2" fill="rgba(7,26,56,0.3)" />

        {/* Bottom lip */}
        <ellipse cx="80" cy="360" rx="48" ry="12" fill={t.edge} opacity="0.85" />
        <ellipse cx="80" cy="356" rx="44" ry="8" fill={t.body} />

        {/* Label panel */}
        <rect
          x="44"
          y="120"
          width="72"
          height="150"
          rx="10"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />

        <text
          x="80"
          y="158"
          textAnchor="middle"
          fill="#00A9CB"
          fontFamily="var(--font-display), system-ui, sans-serif"
          fontSize="9"
          letterSpacing="3"
        >
          PÁDEL
        </text>
        <text
          x="80"
          y="178"
          textAnchor="middle"
          fill={t.ink}
          fontFamily="var(--font-display), system-ui, sans-serif"
          fontSize="14"
          fontWeight="700"
          letterSpacing="2"
        >
          WATER
        </text>
        <line
          x1="62"
          y1="190"
          x2="98"
          y2="190"
          stroke={t.mute}
          strokeWidth="1"
        />

        {!quiet ? (
          <>
            <text
              x="80"
              y="230"
              textAnchor="middle"
              fill={t.ink}
              fontFamily="var(--font-display), system-ui, sans-serif"
              fontSize="22"
              fontWeight="700"
              letterSpacing="-0.5"
            >
              {product.volume.toUpperCase()}
            </text>
            <text
              x="80"
              y="252"
              textAnchor="middle"
              fill={t.mute}
              fontFamily="system-ui, sans-serif"
              fontSize="8"
              letterSpacing="2"
            >
              {product.flavorLabel.toUpperCase()}
            </text>
          </>
        ) : null}

        <text
          x="80"
          y="300"
          textAnchor="middle"
          fill={t.mute}
          fontFamily="system-ui, sans-serif"
          fontSize="5.5"
          letterSpacing="1.4"
        >
          FOTOGRAFÍA FINAL PENDIENTE
        </text>

        {/* Cylinder shine */}
        <path
          d="M28 52
             C28 40 48 32 80 32
             C112 32 132 40 132 52
             L128 360
             C128 372 108 382 80 382
             C52 382 32 372 32 360
             Z"
          fill={`url(#${uid}-shine)`}
        />
      </svg>
    </div>
  );
}
