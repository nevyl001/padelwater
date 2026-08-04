"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";
import { resolveCanImage, brandAssetPaths } from "@/data/brand-assets";
import { product } from "@/data/product";

type ProductCanImageProps = {
  className?: string;
  src?: string | null;
  priority?: boolean;
  size?: "hero" | "story" | "inline" | "showcase";
};

/** Tallboy can proportions (~2:5) with transparent cutout. */
const sizeClass = {
  hero: "w-[min(42vw,200px)] sm:w-[220px] md:w-[260px] lg:w-[280px]",
  showcase: "w-[min(48vw,220px)] sm:w-[240px] md:w-[280px] xl:w-[300px]",
  story: "w-[min(46vw,230px)]",
  inline: "w-full max-w-[220px]",
} as const;

/**
 * Official product photography — can cutout on transparent background.
 */
export function ProductCanImage({
  className,
  src,
  priority = false,
  size = "inline",
}: ProductCanImageProps) {
  const image = resolveCanImage(
    src ??
      (size === "hero" ? brandAssetPaths.canHero : null) ??
      product.media.front ??
      product.media.hero,
  );

  return (
    <div
      className={cn(
        "relative mx-auto aspect-[334/785]",
        sizeClass[size],
        className,
      )}
      data-product-can-image
    >
      <Image
        src={image}
        alt={`${product.name} ${product.flavorLabel}, ${product.volume}`}
        fill
        sizes="(max-width: 768px) 48vw, 300px"
        className="object-contain drop-shadow-[0_32px_48px_rgba(0,169,203,0.35)]"
        priority={priority}
      />
    </div>
  );
}
