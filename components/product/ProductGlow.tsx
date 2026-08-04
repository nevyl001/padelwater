import { cn } from "@/lib/cn";

type ProductGlowProps = {
  className?: string;
  tone?: "cyan" | "lime";
};

const toneClass: Record<NonNullable<ProductGlowProps["tone"]>, string> = {
  cyan: "bg-pw-cyan/35",
  lime: "bg-pw-lime/30",
};

/** Ambient bloom seated under the product — cyan/lime from packaging light. */
export function ProductGlow({ className, tone = "cyan" }: ProductGlowProps) {
  return (
    <div
      aria-hidden
      data-product-glow
      className={cn(
        "pointer-events-none absolute bottom-[10%] left-1/2 h-28 w-[60%] -translate-x-1/2 rounded-[100%] blur-3xl",
        toneClass[tone],
        className,
      )}
    />
  );
}
