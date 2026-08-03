"use client";

import { cn } from "@/lib/cn";
import { resolveCanImage } from "@/data/brand-assets";
import { product } from "@/data/product";

type ProductCanImageProps = {
  className?: string;
  src?: string | null;
  priority?: boolean;
  tone?: "navy" | "ice" | "water" | "lime";
  fitHeight?: boolean;
  label?: string;
};

const tones = {
  navy: "border-white/15 bg-gradient-to-b from-[#0a2548] to-[#031126]",
  ice: "border-pw-navy/10 bg-gradient-to-b from-white to-[#e8f4f3]",
  water: "border-white/20 bg-gradient-to-b from-[#0c8fb0]/40 to-[#064d63]/50",
  lime: "border-pw-navy/10 bg-gradient-to-b from-[#eef8c8] to-[#d4ec8a]",
} as const;

/**
 * Front product visual. When assets are not ready, shows an editorial
 * silhouette placeholder — never a fake photoreal can.
 */
export function ProductCanImage({
  className,
  src,
  priority = false,
  tone = "navy",
  fitHeight = false,
  label = "Producto final pendiente",
}: ProductCanImageProps) {
  const image = resolveCanImage(src ?? product.media.front ?? product.media.hero);

  return (
    <div
      className={cn(
        "relative mx-auto overflow-hidden rounded-[1.25rem] border shadow-[var(--shadow-can)]",
        fitHeight
          ? "aspect-[3/7] h-[min(58svh,440px)] w-auto"
          : "aspect-[3/7] w-full max-w-[280px]",
        tones[tone],
        className,
      )}
      data-product-can-image
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- path may be null until assets land; next/image when ready
        <img
          src={image}
          alt={`${product.name} ${product.flavorLabel}, ${product.volume}`}
          className="h-full w-full object-contain"
          fetchPriority={priority ? "high" : "auto"}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-5">
          <div
            aria-hidden
            className="h-[68%] w-[44%] rounded-[1.75rem] border border-dashed border-current/30 bg-current/[0.03]"
          />
          <div className="space-y-1 text-center">
            <p className="font-display text-[0.7rem] uppercase tracking-[0.22em] text-current/55">
              {product.volume}
            </p>
            <p className="max-w-[9rem] text-[0.6rem] uppercase tracking-[0.16em] text-current/40">
              {label}
            </p>
          </div>
          <span className="sr-only">
            {product.name} {product.flavorLabel}, {product.volume}. Imagen final
            pendiente.
          </span>
        </div>
      )}
    </div>
  );
}
