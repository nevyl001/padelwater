"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

type WordmarkProps = {
  className?: string;
  href?: string;
  tone?: "light" | "dark";
  onNavigate?: () => void;
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
  onNavigate,
}: WordmarkProps) {
  const pathname = usePathname();
  const router = useRouter();

  function goHome(e: React.MouseEvent<HTMLAnchorElement>) {
    onNavigate?.();

    if (href !== "/") return;

    // Already on home: scroll to the top instead of a no-op
    if (pathname === "/") {
      e.preventDefault();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      // Keep URL clean if a hash was present
      if (window.location.hash) {
        router.replace("/", { scroll: false });
      }
    }
  }

  return (
    <Link
      href={href}
      onClick={goHome}
      className={cn(
        "font-display text-[1.05rem] font-bold uppercase leading-none tracking-[0.04em] md:text-[1.15rem]",
        tone === "light" ? "text-pw-white" : "text-pw-ink",
        className,
      )}
      aria-label="Pádel Water — volver al inicio"
    >
      <span className="text-pw-cyan">Pádel</span>{" "}
      <span className={tone === "light" ? "text-pw-lime" : "text-pw-navy"}>
        Water
      </span>
    </Link>
  );
}
