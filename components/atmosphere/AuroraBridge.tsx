"use client";

import { cn } from "@/lib/cn";
import { AuroraField } from "@/components/atmosphere/AuroraField";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ProductCanStage } from "@/components/product/ProductCanStage";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

type AuroraBridgeProps = {
  className?: string;
  eyebrow?: string;
  title: string;
  text?: string;
  ctaLabel?: string;
  ctaHref?: string;
  showProduct?: boolean;
  tone?: "navy" | "water" | "deep";
  id?: string;
};

/**
 * Narrative aurora transition — not an orphan footer block.
 * Text + optional CTA/product sit inside the composition.
 */
export function AuroraBridge({
  className,
  eyebrow,
  title,
  text,
  ctaLabel,
  ctaHref,
  showProduct = false,
  tone = "navy",
  id,
}: AuroraBridgeProps) {
  const { prefersReducedMotion, profile } = useMotionPreferences();
  const animated = profile.enableAurora && !prefersReducedMotion;

  return (
    <section
      id={id}
      data-scene="aurora-bridge"
      className={cn(
        "relative overflow-hidden section-pad text-pw-white",
        className,
      )}
      aria-label={title}
    >
      <AuroraField tone={tone} animated={animated} intensity="medium" />

      <Container className="relative z-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.7fr)]">
        <div className="max-w-xl">
          {eyebrow ? (
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-pw-lime/80">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-4 text-editorial text-pw-white">{title}</h2>
          {text ? (
            <p className="mt-5 max-w-md text-body-lg text-white/65">{text}</p>
          ) : null}
          {ctaLabel && ctaHref ? (
            <div className="mt-8">
              <Button href={ctaHref} size="lg" magnetic>
                {ctaLabel}
              </Button>
            </div>
          ) : null}
        </div>

        {showProduct ? (
          <div className="relative mx-auto flex min-h-[280px] w-full max-w-[220px] items-center justify-center lg:mx-0 lg:justify-end">
            <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(0,169,203,0.28),transparent_65%)] blur-2xl" />
            <ProductCanStage mode="inline" tone="navy" size="inline" showReflection={false} />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
