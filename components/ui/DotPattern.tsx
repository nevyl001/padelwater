import { cn } from "@/lib/cn";

type DotPatternProps = {
  className?: string;
  color?: "lime" | "cyan" | "white";
};

export function DotPattern({ className, color = "lime" }: DotPatternProps) {
  const fill =
    color === "lime"
      ? "rgba(183,243,51,0.55)"
      : color === "cyan"
        ? "rgba(0,169,203,0.45)"
        : "rgba(255,255,255,0.35)";

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute", className)}
      style={{
        backgroundImage: `radial-gradient(circle, ${fill} 1.1px, transparent 1.2px)`,
        backgroundSize: "12px 12px",
        maskImage:
          "radial-gradient(ellipse at center, black 10%, transparent 72%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 10%, transparent 72%)",
      }}
    />
  );
}
