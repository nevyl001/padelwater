"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { ProductCanImage } from "@/components/product/ProductCanImage";
import { ProductReflection } from "@/components/product/ProductReflection";
import { ProductHighlight } from "@/components/product/ProductHighlight";

type ProductCanStageProps = {
  className?: string;
  size?: "hero" | "story" | "inline" | "showcase";
  showReflection?: boolean;
  priority?: boolean;
  mode?: "fixed" | "inline" | "ghost";
};

export const ProductCanStage = forwardRef<HTMLDivElement, ProductCanStageProps>(
  function ProductCanStage(
    {
      className,
      size = "inline",
      showReflection = true,
      priority = false,
      mode = "inline",
    },
    ref,
  ) {
    if (mode === "ghost") {
      return (
        <div
          ref={ref}
          aria-hidden
          className={cn(
            "aspect-[334/785]",
            size === "hero" &&
              "w-[min(42vw,200px)] sm:w-[220px] md:w-[260px]",
            size === "showcase" &&
              "w-[min(48vw,220px)] sm:w-[240px] md:w-[280px]",
            size === "story" && "w-[min(46vw,230px)]",
            size === "inline" && "w-full max-w-[220px]",
            className,
          )}
          data-can-anchor
        />
      );
    }

    return (
      <div
        ref={ref}
        data-can-stage={mode}
        className={cn(
          "relative",
          mode === "fixed" && "pointer-events-none fixed left-0 top-0 z-30",
          className,
        )}
      >
        <div className="relative">
          <ProductCanImage size={size} priority={priority} />
          <ProductHighlight />
        </div>
        {showReflection ? <ProductReflection /> : null}
      </div>
    );
  },
);
