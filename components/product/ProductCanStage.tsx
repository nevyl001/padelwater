"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { ProductCanImage } from "@/components/product/ProductCanImage";
import { ProductReflection } from "@/components/product/ProductReflection";
import { ProductHighlight } from "@/components/product/ProductHighlight";

type ProductCanStageProps = {
  className?: string;
  tone?: "navy" | "ice" | "water" | "lime";
  size?: "hero" | "story" | "inline";
  quiet?: boolean;
  showReflection?: boolean;
  priority?: boolean;
  mode?: "fixed" | "inline" | "ghost";
};

export const ProductCanStage = forwardRef<HTMLDivElement, ProductCanStageProps>(
  function ProductCanStage(
    {
      className,
      tone = "navy",
      size = "inline",
      quiet = false,
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
            size === "hero" && "aspect-[3/7] h-[min(58svh,440px)] w-auto",
            size === "story" &&
              "aspect-[3/7] h-[min(44svh,360px)] w-auto max-md:h-[min(38svh,300px)]",
            size === "inline" && "aspect-[3/7] w-full max-w-[240px]",
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
            size={size}
            quiet={quiet}
            priority={priority}
          />
          <ProductHighlight />
        </div>
        {showReflection ? <ProductReflection /> : null}
      </div>
    );
  },
);
