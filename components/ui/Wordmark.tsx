import Link from "next/link";
import { cn } from "@/lib/cn";

type WordmarkProps = {
  className?: string;
  href?: string;
  tone?: "light" | "dark";
};

/**
 * PROVISIONAL_WORDMARK
 * Temporary typographic mark until the official logo asset is delivered.
 * Do not invent a new monogram or logo mark.
 */
export function Wordmark({
  className,
  href = "/",
  tone = "dark",
}: WordmarkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "font-display text-[1.05rem] font-bold uppercase leading-none tracking-[0.04em] md:text-[1.15rem]",
        tone === "light" ? "text-pw-white" : "text-pw-ink",
        className,
      )}
      aria-label="Pádel Water — inicio"
    >
      <span className={tone === "light" ? "text-pw-cyan" : "text-pw-cyan"}>
        Pádel
      </span>{" "}
      <span className={tone === "light" ? "text-pw-lime" : "text-pw-navy"}>
        Water
      </span>
    </Link>
  );
}
