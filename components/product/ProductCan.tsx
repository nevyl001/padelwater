import { MediaSlot } from "@/components/ui/MediaSlot";
import { cn } from "@/lib/cn";
import { product } from "@/data/product";

type ProductCanProps = {
  className?: string;
  src?: string | null;
  priority?: boolean;
  tone?: "navy" | "ice" | "water" | "lime";
  showReflection?: boolean;
};

/**
 * Product protagonist slot. Replace `src` / product.media when final
 * photography arrives — do not synthesize a fake can.
 */
export function ProductCan({
  className,
  src,
  priority = false,
  tone = "navy",
  showReflection = true,
}: ProductCanProps) {
  const image = src ?? product.media.hero ?? product.media.front;

  return (
    <div className={cn("relative mx-auto w-full max-w-[280px]", className)}>
      <MediaSlot
        src={image}
        alt={`${product.name} ${product.flavorLabel}, ${product.volume}`}
        aspect="can"
        priority={priority}
        tone={tone}
        label="Lata 470 ml"
        className="shadow-[var(--shadow-can)]"
      />
      {showReflection ? <ProductReflection /> : null}
    </div>
  );
}

export function ProductReflection({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none mx-auto mt-3 h-10 w-[70%] rounded-[100%] bg-pw-navy/25 blur-xl",
        className,
      )}
    />
  );
}
