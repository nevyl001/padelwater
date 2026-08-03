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
        "text-[0.68rem] font-medium uppercase tracking-[0.26em]",
        tone === "light" && "text-white/75",
        tone === "dark" && "text-pw-navy/55",
        tone === "lime" && "text-pw-lime",
        className,
      )}
    >
      {children}
    </p>
  );
}
