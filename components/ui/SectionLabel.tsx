import { cn } from "@/lib/cn";

type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark" | "lime";
};

export function SectionLabel({
  children,
  className,
  tone = "dark",
}: SectionLabelProps) {
  return (
    <p
      className={cn(
        "text-[0.8rem] font-semibold uppercase tracking-[0.26em] md:text-[0.88rem] md:tracking-[0.28em]",
        tone === "light" && "text-white/85",
        tone === "dark" && "text-pw-navy/70",
        tone === "lime" && "text-pw-lime",
        className,
      )}
    >
      {children}
    </p>
  );
}
