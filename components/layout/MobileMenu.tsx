"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { navigation, headerCta } from "@/data/site-content";
import { Wordmark } from "@/components/ui/Wordmark";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { useFocusTrap } from "@/components/ui/Accordion";
import { durations, easings } from "@/lib/motion";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const trapRef = useFocusTrap(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={trapRef}
          className="fixed inset-0 z-[65] flex flex-col bg-pw-navy-deep text-pw-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: durations.fast }}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          <div className="flex items-center justify-between px-5 py-4">
            <Wordmark tone="light" onNavigate={onClose} />
            <button
              type="button"
              onClick={onClose}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20"
              aria-label="Cerrar menú"
            >
              ×
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-2 px-6">
            {navigation.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="font-display text-4xl uppercase tracking-tight text-pw-white"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.05 * i,
                  duration: durations.base,
                  ease: easings.outExpo,
                }}
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          <div className="px-6 pb-10">
            <WhatsAppLink size="lg" magnetic={false} className="w-full">
              {headerCta.label}
            </WhatsAppLink>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
