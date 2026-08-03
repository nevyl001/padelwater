"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, type KeyboardEvent } from "react";
import { TextReveal } from "@/components/motion/TextReveal";
import { cn } from "@/lib/cn";

type FAQItemData = { question: string; answer: string };

type FAQItemProps = {
  item: FAQItemData;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
};

/** Sentence-level split — the closest thing to "real lines" we can get
 * without teaching MaskReveal to measure wrapped text (that primitive
 * is shared by five other live scenes; not touching it here). */
function splitIntoSentences(text: string): string[] {
  const matches = text.match(/[^.]+\.+(\s+|$)/g);
  if (!matches) return [text];
  return matches.map((s) => s.trim()).filter(Boolean);
}

function PlusMinusIcon({ open }: { open: boolean }) {
  const spring = { type: "spring" as const, stiffness: 320, damping: 24 };
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors duration-300",
        open
          ? "border-pw-lime/70 text-pw-navy shadow-[0_0_0_5px_rgba(183,243,51,0.14)]"
          : "border-pw-ink/15 text-pw-ink/60 group-hover:border-pw-ink/30 group-hover:text-pw-ink",
      )}
    >
      <motion.span
        className="absolute h-[1.5px] w-3.5 rounded-full bg-current"
        animate={{ rotate: open ? 45 : 0 }}
        transition={spring}
      />
      <motion.span
        className="absolute h-[1.5px] w-3.5 rounded-full bg-current"
        animate={{ rotate: open ? 135 : 90 }}
        transition={spring}
      />
    </span>
  );
}

export function FAQItem({ item, index, isOpen, onToggle, onKeyDown, buttonRef }: FAQItemProps) {
  const prefersReducedMotion = useReducedMotion();
  const lines = splitIntoSentences(item.answer);
  const answerRef = useRef<HTMLParagraphElement>(null);

  // Manual mode, triggered directly by isOpen — not a scroll-into-view
  // reveal, so it doesn't ride MaskReveal's ScrollTrigger path (which
  // can mis-time here: opening a lower item shifts every row above it
  // via the layout FLIP animation at the same instant the new content
  // mounts, and a scroll-position check can catch it mid-shift).
  useEffect(() => {
    if (!isOpen || prefersReducedMotion) return;
    const root = answerRef.current;
    if (!root) return;

    let dead = false;
    let cleanup: (() => void) | undefined;

    async function run() {
      const { getGsap } = await import("@/lib/animation/gsap");
      const { gsap } = getGsap();
      if (dead || !root) return;
      const units = root.querySelectorAll("[data-mask-unit]");
      const tween = gsap.fromTo(
        units,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.6, delay: 0.15, stagger: 0.08, ease: "expo.out" },
      );
      cleanup = () => tween.kill();
    }

    void run();
    return () => {
      dead = true;
      cleanup?.();
    };
  }, [isOpen, prefersReducedMotion]);

  return (
    <motion.div
      layout
      transition={{ layout: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border transition-colors duration-300",
        isOpen
          ? "border-pw-navy/10 bg-pw-ice/70 shadow-[0_24px_50px_-32px_rgba(3,17,38,0.4)]"
          : "border-transparent hover:bg-pw-ink/[0.02]",
      )}
    >
      <motion.span
        aria-hidden
        className="absolute inset-y-4 left-0 w-[3px] origin-top rounded-full bg-pw-lime"
        initial={false}
        animate={{ scaleY: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      />

      <motion.button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        onKeyDown={onKeyDown}
        whileTap={{ scale: 0.99 }}
        className="flex w-full items-center gap-5 rounded-2xl px-5 py-6 text-left md:px-7"
      >
        <span className="font-display text-sm text-pw-lime md:text-base">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={cn(
            "flex-1 font-display uppercase tracking-[-0.01em] transition-all duration-300",
            isOpen ? "text-xl text-pw-navy md:text-2xl" : "text-lg text-pw-ink md:text-xl",
          )}
        >
          {item.question}
        </span>
        <PlusMinusIcon open={isOpen} />
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0.01 }
                : {
                    height: { type: "spring", stiffness: 280, damping: 32 },
                    opacity: { duration: 0.25 },
                  }
            }
            className="overflow-hidden"
          >
            <div className="max-w-2xl px-5 pb-7 pl-[3.25rem] pr-8 md:px-7 md:pl-[3.75rem]">
              <TextReveal
                ref={answerRef}
                as="p"
                variant="bodyLg"
                mode="manual"
                lines={lines}
                className="text-pw-muted"
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
