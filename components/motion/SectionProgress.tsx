import { cn } from "@/lib/cn";

type SectionProgressProps = {
  total: number;
  active: number;
  className?: string;
  tone?: "light" | "dark";
};

/**
 * Local step indicator for a scene with discrete stages (e.g. the
 * product story's pinned scroll) — distinct from ScrollProgress, which
 * tracks whole-page scroll. Plain CSS transitions: a step dot doesn't
 * need GSAP or Motion, just a value that changes.
 */
export function SectionProgress({ total, active, className, tone = "light" }: SectionProgressProps) {
  return (
    <div
      aria-hidden
      data-section-progress
      className={cn("flex items-center gap-2", tone === "light" ? "text-white" : "text-pw-navy", className)}
    >
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={cn(
            "h-1.5 rounded-full bg-current transition-all duration-300",
            index === active ? "w-6 opacity-90" : "w-1.5 opacity-30",
          )}
        />
      ))}
    </div>
  );
}
