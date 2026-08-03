"use client";

import { brandStatement } from "@/data/site-content";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { Container } from "@/components/ui/Container";
import { AuroraField } from "@/components/atmosphere/AuroraField";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

/**
 * Brand declaration seated inside an aurora transition —
 * connects product narrative to benefits without feeling like a flat band.
 */
export function BrandStatement() {
  const { prefersReducedMotion, profile } = useMotionPreferences();
  const animated = profile.enableAurora && !prefersReducedMotion;

  return (
    <section
      id="declaracion"
      className="relative overflow-hidden section-pad anchor-offset text-pw-white"
      aria-label="Declaración de marca"
    >
      <AuroraField tone="navy" animated={animated} intensity="soft" />
      <Container className="relative z-10 max-w-5xl text-center">
        <SplitTextReveal
          lines={brandStatement.lines}
          className="text-editorial text-pw-white"
          lineClassName="text-editorial text-pw-white"
        />
      </Container>
    </section>
  );
}
