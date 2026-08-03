import { ProductCanImage } from "@/components/product/ProductCanImage";
import { ProductReflection } from "@/components/product/ProductReflection";
import { cn } from "@/lib/cn";

type ProductCanProps = {
  className?: string;
  src?: string | null;
  priority?: boolean;
  tone?: "navy" | "ice" | "water" | "lime";
  showReflection?: boolean;
  fitHeight?: boolean;
};

/** Compatibility wrapper for sections outside the launch sequence. */
export function ProductCan({
  className,
  src,
  priority = false,
  tone = "navy",
  showReflection = true,
  fitHeight = false,
}: ProductCanProps) {
  return (
    <div className={cn("relative mx-auto w-full max-w-[280px]", className)}>
      <ProductCanImage
        src={src}
        priority={priority}
        tone={tone}
        size={fitHeight ? "hero" : "inline"}
        className="max-w-none"
      />
      {showReflection ? <ProductReflection /> : null}
    </div>
  );
}

export { ProductReflection } from "@/components/product/ProductReflection";
