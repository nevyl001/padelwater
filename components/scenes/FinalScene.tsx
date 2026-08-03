"use client";

import { useRef } from "react";
import { finalCta } from "@/data/site-content";
import { Container } from "@/components/ui/Container";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { DotPattern } from "@/components/ui/DotPattern";
import { ProductCanStage } from "@/components/product/ProductCanStage";
import { ProductGlow } from "@/components/product/ProductGlow";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { useFinalSceneTimeline } from "@/components/scenes/useFinalSceneTimeline";
import { cn } from "@/lib/cn";

/**
 * Closing scene — an elegant, quiet CTA rather than a showy finale.
 * Rhythm borrows from Motion Footer's idea (large type, one clear
 * action, ambient glow) without copying its curtain reveal or marquee.
 */
export function FinalScene() {
  const rootRef = useRef<HTMLElement>(null);
  const canRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const { ready, prefersReducedMotion } = useMotionPreferences();

  useFinalSceneTimeline(
    { rootRef, canRef, headlineRef, ctaRef },
    { ready, prefersReducedMotion },
  );

  return (
    <section
      ref={rootRef}
      data-scene="final"
      className="relative overflow-hidden bg-pw-navy-deep section-pad text-pw-white grain"
      aria-label="Llamado a la acción"
    >
      <div
        ref={canRef}
        className={cn(
          "pointer-events-none absolute -right-10 top-1/2 h-[120%] w-[55%] -translate-y-1/2 opacity-90",
          !prefersReducedMotion && "opacity-0",
        )}
      >
        <ProductGlow tone="lime" className="h-full w-full scale-150 opacity-100" />
        <div className="absolute left-1/2 top-1/2 max-w-[360px] -translate-x-[20%] -translate-y-1/2 scale-125">
          <ProductCanStage mode="inline" tone="navy" size="hero" showReflection={false} />
        </div>
      </div>
      <DotPattern className="bottom-0 left-0 h-56 w-56 opacity-50" />

      <Container className="relative z-10 max-w-2xl">
        <TextReveal
          ref={headlineRef}
          as="h2"
          variant="editorial"
          mode="manual"
          lines={[finalCta.title]}
        />
        <MaskReveal ref={ctaRef} as="div" mode="manual" splitBy="block" className="mt-10">
          <WhatsAppLink size="lg" magnetic>
            {finalCta.button}
          </WhatsAppLink>
        </MaskReveal>
      </Container>
    </section>
  );
}
