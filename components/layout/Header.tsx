"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { navigation, headerCta } from "@/data/site-content";
import { Wordmark } from "@/components/ui/Wordmark";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { cn } from "@/lib/cn";
import { durations, easings } from "@/lib/motion";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrollY, setScrollY] = useState(0);
  const [viewportH, setViewportH] = useState(900);
  const [menuOpen, setMenuOpen] = useState(false);
  const { prefersReducedMotion } = useMotionPreferences();

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    const onResize = () => setViewportH(window.innerHeight);
    onScroll();
    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const compact = !isHome || scrollY > 48;
  const overHero = isHome && scrollY < viewportH * 0.85;
  const tone = overHero && !compact ? "light" : "dark";

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-50 pt-[max(0.75rem,env(safe-area-inset-top))] transition-[background,border-color,backdrop-filter,padding] duration-300",
          compact
            ? "border-b border-pw-navy/10 bg-pw-ice/85 pb-3 backdrop-blur-md"
            : "border-b border-transparent bg-transparent pb-4",
        )}
        initial={prefersReducedMotion ? false : { y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0 : durations.mid,
          ease: easings.outExpo,
        }}
      >
        <div className="container-pw flex min-h-12 items-center justify-between gap-6 md:min-h-14">
          <Wordmark tone={tone} />

          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Principal"
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={isHome ? item.href : `/${item.href}`}
                className={cn(
                  "text-sm font-medium transition-colors",
                  tone === "dark"
                    ? "text-pw-ink/75 hover:text-pw-ink"
                    : "text-white/75 hover:text-white",
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <WhatsAppLink className="hidden sm:inline-flex" size="md" magnetic>
              {headerCta.label}
            </WhatsAppLink>

            <button
              type="button"
              className={cn(
                "grid h-11 w-11 place-items-center rounded-full border lg:hidden",
                tone === "dark"
                  ? "border-pw-ink/15 text-pw-ink"
                  : "border-white/25 text-white",
              )}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <span className="flex w-4 flex-col gap-1.5" aria-hidden>
                <span className="block h-px w-full bg-current" />
                <span className="block h-px w-full bg-current" />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
