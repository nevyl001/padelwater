import { cn } from "@/lib/cn";

type ProductGlowProps = {
  className?: string;
  tone?: "cyan" | "lime";
};

const toneClass: Record<NonNullable<ProductGlowProps["tone"]>, string> = {
  cyan: "bg-pw-cyan/25",
  lime: "bg-pw-lime/20",
};

/** Ambient bloom seated under the can — same light source across every scene. */
export function ProductGlow({ className, tone = "cyan" }: ProductGlowProps) {
  return (
    <div
      aria-hidden
      data-product-glow
      className={cn(
        "pointer-events-none absolute bottom-[10%] left-1/2 h-24 w-[55%] -translate-x-1/2 rounded-[100%] blur-3xl",
        toneClass[tone],
        className,
      )}
    />
  );
}
