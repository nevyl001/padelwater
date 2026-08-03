"use client";

import { useState } from "react";
import { product } from "@/data/product";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { ProductCan } from "@/components/product/ProductCan";
import { ProductInformationPanel } from "@/components/product/ProductInformationPanel";
import { Reveal } from "@/components/motion/Reveal";

export function ProductDetails() {
  const [open, setOpen] = useState(false);

  return (
    <section
      className="bg-pw-white section-pad"
      aria-label="Presentación del producto"
    >
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <ProductCan
            src={product.media.front}
            tone="ice"
            className="max-w-[300px]"
          />
        </Reveal>

        <Reveal delay={100}>
          <SectionLabel>Producto</SectionLabel>
          <h2 className="mt-4 text-editorial text-pw-navy">{product.name}</h2>
          <dl className="mt-8 space-y-4 text-pw-ink">
            <div className="flex items-baseline justify-between gap-6 border-b border-pw-ink/10 pb-3">
              <dt className="text-sm text-pw-muted">Sabor</dt>
              <dd className="font-medium">{product.flavorLabel}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-6 border-b border-pw-ink/10 pb-3">
              <dt className="text-sm text-pw-muted">Presentación</dt>
              <dd className="font-medium">{product.volume}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-6 border-b border-pw-ink/10 pb-3">
              <dt className="text-sm text-pw-muted">Característica</dt>
              <dd className="font-medium">{product.feature}</dd>
            </div>
          </dl>
          <p className="mt-6 max-w-md text-pw-muted">{product.description}</p>
          <div className="mt-8">
            <Button variant="ghost" onClick={() => setOpen(true)}>
              Ver información del producto
            </Button>
          </div>
        </Reveal>
      </Container>

      <ProductInformationPanel open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
