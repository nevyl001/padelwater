"use client";

import { cn } from "@/lib/cn";
import { resolveCanImage } from "@/data/brand-assets";
import { product } from "@/data/product";
import { ProductCanSilhouette } from "@/components/product/ProductCanSilhouette";

type ProductCanImageProps = {
  className?: string;
  src?: string | null;
  priority?: boolean;
  tone?: "navy" | "ice" | "water" | "lime";
  size?: "hero" | "story" | "inline" | "showcase";
  quiet?: boolean;
  label?: string;
  /** Only the hero should pass this in development. */
  showPendingLabel?: boolean;
};

const sizeClass = {
  hero: "aspect-[2/5] h-[min(30svh,240px)] w-auto sm:h-[min(42svh,320px)] md:h-[min(60svh,480px)]",
  /** Larger presence on mobile showcase — avoids tiny can + empty air */
  showcase:
    "aspect-[2/5] h-[min(46svh,340px)] w-auto sm:h-[min(50svh,380px)] md:h-[min(60svh,480px)]",
  story:
    "aspect-[2/5] h-[min(54svh,460px)] w-auto max-md:h-[min(46svh,340px)]",
  inline: "aspect-[2/5] w-full max-w-[240px]",
} as const;

/**
 * Front product visual. Real photo when assets are ready;
 * otherwise a true can silhouette (not a rounded card).
 */
export function ProductCanImage({
  className,
  src,
  priority = false,
  tone = "navy",
  size = "inline",
  quiet = false,
  showPendingLabel = false,
}: ProductCanImageProps) {
  const image = resolveCanImage(src ?? product.media.front ?? product.media.hero);

  if (image) {
    return (
      <div
        className={cn("relative mx-auto", sizeClass[size], className)}
        data-product-can-image
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={`${product.name} ${product.flavorLabel}, ${product.volume}`}
          className="h-full w-full object-contain"
          fetchPriority={priority ? "high" : "auto"}
        />
      </div>
    );
  }

  return (
    <ProductCanSilhouette
      tone={tone}
      quiet={quiet}
      showPendingLabel={showPendingLabel}
      className={cn(sizeClass[size], className)}
    />
  );
}
