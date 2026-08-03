"use client";

import { cn } from "@/lib/cn";
import { resolveCanImage } from "@/data/brand-assets";
import { product } from "@/data/product";

type ProductCanImageProps = {
  className?: string;
  src?: string | null;
  priority?: boolean;
  tone?: "navy" | "ice" | "water" | "lime";
  /** Visual scale. Story must stay short so stage copy never piles on the can. */
  size?: "hero" | "story" | "inline";
  /** Minimal face — brand only, no giant volume (avoids fighting stage headlines). */
  quiet?: boolean;
  label?: string;
};

const shell = {
  navy: {
    body: "from-[#0c2a52] via-[#071a38] to-[#031126]",
    rim: "border-white/20",
    ink: "text-white",
    muted: "text-white/55",
  },
  ice: {
    body: "from-white via-[#f2faf8] to-[#d9ecea]",
    rim: "border-pw-navy/15",
    ink: "text-pw-navy",
    muted: "text-pw-navy/55",
  },
  water: {
    body: "from-[#0ea3c4] via-[#087a9a] to-[#045066]",
    rim: "border-white/25",
    ink: "text-white",
    muted: "text-white/60",
  },
  lime: {
    body: "from-[#eef8c8] via-[#d8f08a] to-[#b7f333]",
    rim: "border-pw-navy/15",
    ink: "text-pw-navy",
    muted: "text-pw-navy/55",
  },
} as const;

const sizeClass = {
  hero: "aspect-[3/7] h-[min(58svh,440px)] w-auto",
  story:
    "aspect-[3/7] h-[min(58svh,480px)] w-auto max-md:h-[min(42svh,320px)]",
  inline: "aspect-[3/7] w-full max-w-[240px]",
} as const;

/**
 * Front product visual. Without final photography, shows an editorial
 * brand silhouette — never a fake photo.
 */
export function ProductCanImage({
  className,
  src,
  priority = false,
  tone = "navy",
  size = "inline",
  quiet = false,
  label = "Fotografía final pendiente",
}: ProductCanImageProps) {
  const image = resolveCanImage(src ?? product.media.front ?? product.media.hero);
  const t = shell[tone];

  return (
    <div
      className={cn(
        "relative mx-auto overflow-hidden rounded-[1.5rem] border shadow-[var(--shadow-can)]",
        sizeClass[size],
        t.rim,
        className,
      )}
      data-product-can-image
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- path may be null until assets land
        <img
          src={image}
          alt={`${product.name} ${product.flavorLabel}, ${product.volume}`}
          className="h-full w-full object-contain"
          fetchPriority={priority ? "high" : "auto"}
        />
      ) : (
        <div
          className={cn(
            "absolute inset-0 flex flex-col bg-gradient-to-b",
            t.body,
            t.ink,
          )}
        >
          <div className="relative h-[12%] shrink-0 bg-pw-lime">
            <div className="absolute inset-x-[18%] top-1/2 h-px -translate-y-1/2 bg-pw-navy/20" />
          </div>

          <div className="relative flex flex-1 flex-col items-center justify-center gap-3 px-4 pb-5 pt-4">
            <div className="text-center">
              <p className="font-display text-[0.5rem] uppercase tracking-[0.28em] text-pw-cyan md:text-[0.55rem]">
                Pádel
              </p>
              <p className="mt-0.5 font-display text-[0.65rem] font-bold uppercase tracking-[0.16em] md:text-[0.72rem]">
                Water
              </p>
            </div>

            {!quiet ? (
              <div className="flex flex-col items-center gap-1.5">
                <p className="font-display text-[clamp(1.1rem,2.8vw,1.55rem)] font-bold uppercase leading-none tracking-[-0.03em]">
                  {product.volume}
                </p>
                <p className={cn("text-[0.52rem] uppercase tracking-[0.2em]", t.muted)}>
                  {product.flavorLabel}
                </p>
              </div>
            ) : (
              <div className="h-px w-8 bg-current/20" />
            )}

            <p className={cn("mt-auto text-[0.42rem] uppercase tracking-[0.18em]", t.muted)}>
              {label}
            </p>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-[12%] w-px bg-gradient-to-b from-transparent via-white/35 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.18),transparent_45%)]"
          />

          <span className="sr-only">
            {product.name} {product.flavorLabel}, {product.volume}. Imagen final
            pendiente.
          </span>
        </div>
      )}
    </div>
  );
}
