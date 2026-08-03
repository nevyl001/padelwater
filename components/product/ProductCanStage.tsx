"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { ProductCanImage } from "@/components/product/ProductCanImage";
import { ProductReflection } from "@/components/product/ProductReflection";
import { ProductHighlight } from "@/components/product/ProductHighlight";

type ProductCanStageProps = {
  className?: string;
  tone?: "navy" | "ice" | "water" | "lime";
  size?: "hero" | "story" | "inline" | "showcase";
  quiet?: boolean;
  showReflection?: boolean;
  priority?: boolean;
  showPendingLabel?: boolean;
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
      showPendingLabel = false,
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
            size === "hero" &&
              "aspect-[2/5] h-[min(36svh,280px)] w-auto sm:h-[min(42svh,340px)] md:h-[min(58svh,480px)]",
            size === "showcase" &&
              "aspect-[2/5] h-[min(54svh,380px)] w-auto sm:h-[min(50svh,400px)] md:h-[min(58svh,480px)] xl:h-[min(60svh,520px)]",
            size === "story" &&
              "aspect-[2/5] h-[min(54svh,460px)] w-auto max-md:h-[min(46svh,340px)]",
            size === "inline" && "aspect-[2/5] w-full max-w-[240px]",
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
          mode === "fixed" &&
            "pointer-events-none fixed left-0 top-0 z-30",
          className,
        )}
      >
        <div className="relative">
          <ProductCanImage
            tone={tone}
            size={size}
            quiet={quiet}
            priority={priority}
            showPendingLabel={showPendingLabel}
          />
          <ProductHighlight />
        </div>
        {showReflection ? <ProductReflection /> : null}
      </div>
    );
  },
);
