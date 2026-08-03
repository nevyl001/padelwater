import { cn } from "@/lib/cn";

export function ProductReflection({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      data-product-reflection
      className={cn(
        "pointer-events-none mx-auto mt-2 h-8 w-[65%] rounded-[100%] bg-pw-navy/30 blur-xl",
        className,
      )}
    />
  );
}
