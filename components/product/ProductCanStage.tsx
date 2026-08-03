"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { ProductCanImage } from "@/components/product/ProductCanImage";
import { ProductReflection } from "@/components/product/ProductReflection";
import { ProductHighlight } from "@/components/product/ProductHighlight";

type ProductCanStageProps = {
  className?: string;
  tone?: "navy" | "ice" | "water" | "lime";
  fitHeight?: boolean;
  showReflection?: boolean;
  priority?: boolean;
  /** When true, stage is the live conductor (fixed). When false, inline fallback. */
  mode?: "fixed" | "inline" | "ghost";
};

/**
 * Single visual conductor for the can across hero → product story.
 * `fixed` = desktop motion stage; `inline` = SSR/mobile/reduced; `ghost` = invisible spacer.
 */
export const ProductCanStage = forwardRef<HTMLDivElement, ProductCanStageProps>(
  function ProductCanStage(
    {
      className,
      tone = "navy",
      fitHeight = false,
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
            fitHeight
              ? "aspect-[3/7] h-[min(58svh,440px)] w-auto"
              : "aspect-[3/7] w-full max-w-[260px]",
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
          "relative will-change-transform",
          mode === "fixed" &&
            "pointer-events-none fixed left-0 top-0 z-30 will-change-transform",
          className,
        )}
      >
        <div className="relative">
          <ProductCanImage
            tone={tone}
            fitHeight={fitHeight}
            priority={priority}
          />
          <ProductHighlight />
        </div>
        {showReflection ? <ProductReflection /> : null}
      </div>
    );
  },
);
