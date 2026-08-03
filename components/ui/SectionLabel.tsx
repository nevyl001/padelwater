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
        "text-[0.7rem] font-medium uppercase tracking-[0.22em]",
        tone === "light" && "text-white/70",
        tone === "dark" && "text-pw-muted",
        tone === "lime" && "text-pw-lime",
        className,
      )}
    >
      {children}
    </p>
  );
}
