"use client";

import { useRef, useState } from "react";
import { product } from "@/data/product";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { ProductCanStage } from "@/components/product/ProductCanStage";
import { ProductGlow } from "@/components/product/ProductGlow";
import { ProductInformationPanel } from "@/components/product/ProductInformationPanel";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { useProductShowcaseSceneTimeline } from "@/components/scenes/useProductShowcaseSceneTimeline";
import { cn } from "@/lib/cn";

const facts = [
  { label: "Sabor", value: product.flavorLabel },
  { label: "Presentación", value: product.volume },
  { label: "Característica", value: product.feature },
] as const;

/**
 * The can as the sole protagonist — no floating tabs, no dock, no
 * variant switcher (there's one flavor today). Composition borrows the
 * "large product, reactive glow" idea from Spatial Product Showcase,
 * rebuilt with our own tokens and the shared TextReveal/MaskReveal
 * system instead of copying its interface.
 */
export function ProductShowcaseScene() {
  const [infoOpen, setInfoOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const canRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const { ready, prefersReducedMotion } = useMotionPreferences();

  useProductShowcaseSceneTimeline(
    { rootRef, canRef, headlineRef, statsRef, ctaRef },
    { ready, prefersReducedMotion },
  );

  return (
    <section
      ref={rootRef}
      data-scene="product-showcase"
      className="relative overflow-hidden bg-pw-white section-pad"
      aria-label="El producto"
    >
      <Container className="grid items-center gap-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] xl:gap-24">
        <div className="relative flex min-h-[min(62svh,480px)] items-center justify-center">
          <ProductGlow tone="lime" className="opacity-70" />
          <div
            ref={canRef}
            className={cn("relative z-10", !prefersReducedMotion && "opacity-0")}
          >
            <ProductCanStage mode="inline" tone="ice" size="hero" />
          </div>
        </div>

        <div className="mx-auto w-full max-w-lg text-center lg:mx-0 lg:text-left">
          <SectionLabel>Producto</SectionLabel>
          <TextReveal
            ref={headlineRef}
            as="h2"
            variant="editorial"
            mode="manual"
            lines={[product.name]}
            className="mt-4 text-pw-navy"
          />
          <p className="mx-auto mt-6 max-w-md text-body-lg text-pw-muted lg:mx-0">
            {product.description}
          </p>

          <MaskReveal
            ref={statsRef}
            as="div"
            mode="manual"
            splitBy="block"
            className="mt-10"
          >
            <dl className="flex flex-wrap justify-center gap-x-8 gap-y-4 border-t border-pw-ink/10 pt-6 lg:justify-start">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs uppercase tracking-[0.2em] text-pw-muted">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 font-display text-xl font-bold uppercase tracking-[-0.01em] text-pw-navy">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </MaskReveal>

          <MaskReveal
            ref={ctaRef}
            as="div"
            mode="manual"
            splitBy="block"
            className="mt-8"
          >
            <Button variant="ghost" onClick={() => setInfoOpen(true)}>
              Ver información del producto
            </Button>
          </MaskReveal>
        </div>
      </Container>

      <ProductInformationPanel open={infoOpen} onClose={() => setInfoOpen(false)} />
    </section>
  );
}
