"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { brandAssetPaths } from "@/data/brand-assets";
import { cn } from "@/lib/cn";

type WordmarkProps = {
  className?: string;
  href?: string;
  tone?: "light" | "dark";
  onNavigate?: () => void;
  /** horizontal = nav/footer; icon = compact mark */
  variant?: "horizontal" | "icon";
};

/**
 * Official Pádel Water mark — never invent a typographic substitute.
 */
export function Wordmark({
  className,
  href = "/",
  tone = "dark",
  onNavigate,
  variant = "horizontal",
}: WordmarkProps) {
  const pathname = usePathname();
  const router = useRouter();

  function goHome(e: React.MouseEvent<HTMLAnchorElement>) {
    onNavigate?.();
    if (href !== "/") return;
    if (pathname === "/") {
      e.preventDefault();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      if (window.location.hash) {
        router.replace("/", { scroll: false });
      }
    }
  }

  const isIcon = variant === "icon";

  return (
    <Link
      href={href}
      onClick={goHome}
      className={cn(
        "relative inline-flex shrink-0 items-center",
        isIcon ? "h-9 w-9 md:h-10 md:w-10" : "h-9 w-[9.5rem] sm:h-10 sm:w-[11rem] md:h-11 md:w-[12.5rem]",
        className,
      )}
      aria-label="Pádel Water — volver al inicio"
    >
      <Image
        src={isIcon ? brandAssetPaths.logoIconPng : brandAssetPaths.logoHorizontalPng}
        alt="Pádel Water"
        fill
        sizes={isIcon ? "40px" : "(max-width: 640px) 152px, 200px"}
        className={cn(
          "object-contain object-left",
          tone === "dark" && "drop-shadow-[0_1px_0_rgba(255,255,255,0.06)]",
        )}
        priority
      />
    </Link>
  );
}
