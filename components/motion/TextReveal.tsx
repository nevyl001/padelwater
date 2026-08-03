"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { MaskReveal, type MaskRevealProps } from "@/components/motion/MaskReveal";

type TextRevealVariant = "display" | "hero" | "editorial" | "section" | "bodyLg" | "body";

const variantClass: Record<TextRevealVariant, string> = {
  display: "text-display",
  hero: "text-hero",
  editorial: "text-editorial",
  section: "text-section",
  bodyLg: "text-body-lg",
  body: "text-base leading-relaxed",
};

const variantTag: Record<TextRevealVariant, MaskRevealProps["as"]> = {
  display: "h2",
  hero: "h1",
  editorial: "h2",
  section: "h2",
  bodyLg: "p",
  body: "p",
};

type TextRevealProps = Omit<MaskRevealProps, "className"> & {
  variant?: TextRevealVariant;
  className?: string;
};

/**
 * The typographic flavor of MaskReveal — this is the "one system" for
 * hero copy, section titles, claims, and the final statement. Extend
 * the variant map instead of building a second reveal component.
 */
export const TextReveal = forwardRef<HTMLElement, TextRevealProps>(function TextReveal(
  { variant = "body", as, className, ...rest },
  ref,
) {
  return (
    <MaskReveal
      ref={ref}
      as={as ?? variantTag[variant]}
      className={cn(variantClass[variant], className)}
      {...rest}
    />
  );
});
