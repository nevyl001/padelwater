"use client";

import { useRef } from "react";
import { finalCta } from "@/data/site-content";
import { Container } from "@/components/ui/Container";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { AuroraField } from "@/components/atmosphere/AuroraField";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { useFinalSceneTimeline } from "@/components/scenes/useFinalSceneTimeline";

/**
 * Compact closing CTA — one line, one action, aurora only.
 */
export function FinalScene() {
  const rootRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const { ready, prefersReducedMotion, profile } = useMotionPreferences();

  useFinalSceneTimeline(
    { rootRef, headlineRef, ctaRef },
    { ready, prefersReducedMotion },
  );

  const animateAurora = ready && profile.enableAurora && !prefersReducedMotion;

  return (
    <section
      ref={rootRef}
      data-scene="final"
      className="relative overflow-hidden bg-pw-navy-deep py-20 text-pw-white grain md:py-24"
      aria-label="Llamado a la acción"
    >
      <AuroraField
        tone="deep"
        animated={animateAurora}
        intensity="soft"
        className="opacity-95"
      />

      <Container className="relative z-10 max-w-3xl text-center">
        <TextReveal
          ref={headlineRef}
          as="h2"
          variant="editorial"
          mode="manual"
          lines={[finalCta.title]}
          className="mx-auto"
        />
        <MaskReveal
          ref={ctaRef}
          as="div"
          mode="manual"
          splitBy="block"
          className="mt-9 flex justify-center md:mt-10"
        >
          <WhatsAppLink size="lg" magnetic>
            {finalCta.button}
          </WhatsAppLink>
        </MaskReveal>
      </Container>
    </section>
  );
}
