import { cn } from "@/lib/cn";

type BrandDiagonalsProps = {
  className?: string;
  /** soft = wash; bold = label-like energy */
  intensity?: "soft" | "bold";
  tone?: "navy" | "water";
};

/**
 * 45° stripe rhythm from the official label — atmospheric, not a reprint.
 */
export function BrandDiagonals({
  className,
  intensity = "soft",
  tone = "navy",
}: BrandDiagonalsProps) {
  const bold = intensity === "bold";

  return (
    <div
      aria-hidden
      data-brand-diagonals
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className={cn(
          "absolute -inset-[40%] rotate-[-28deg]",
          tone === "navy" &&
            (bold
              ? "bg-[repeating-linear-gradient(-28deg,transparent_0_28px,rgba(0,169,203,0.14)_28px_30px,transparent_30px_58px,rgba(191,215,69,0.12)_58px_60px)]"
              : "bg-[repeating-linear-gradient(-28deg,transparent_0_36px,rgba(0,169,203,0.08)_36px_37px,transparent_37px_72px,rgba(191,215,69,0.06)_72px_73px)]"),
          tone === "water" &&
            "bg-[repeating-linear-gradient(-28deg,transparent_0_32px,rgba(255,255,255,0.08)_32px_33px,transparent_33px_64px,rgba(191,215,69,0.1)_64px_66px)]",
        )}
      />
      <div
        className={cn(
          "absolute inset-0 opacity-40",
          "bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.14)_1px,transparent_0)] [background-size:14px_14px]",
          !bold && "opacity-20",
        )}
      />
    </div>
  );
}
