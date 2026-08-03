import { coconutSection } from "@/data/site-content";
import { product } from "@/data/product";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { DotPattern } from "@/components/ui/DotPattern";
import { Reveal } from "@/components/motion/Reveal";

export function CoconutSection() {
  return (
    <section
      id="sabor"
      className="relative overflow-hidden bg-[#0B8FAF] section-pad anchor-offset text-pw-white"
      aria-label="Sabor coco"
    >
      <DotPattern className="left-[-5%] top-[-10%] h-[40%] w-[40%] opacity-40" />
      <Container className="relative grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <Reveal>
          <SectionLabel tone="light">{coconutSection.eyebrow}</SectionLabel>
          <h2 className="mt-4 text-editorial">{coconutSection.title}</h2>
          <p className="mt-6 max-w-lg text-body-lg text-white/75">
            {coconutSection.text}
          </p>
          <p className="mt-8 text-xs uppercase tracking-[0.22em] text-white/50">
            {product.flavorLabel} · {product.volume}
          </p>
        </Reveal>

        <Reveal delay={120}>
          <MediaSlot
            src={product.media.coconut}
            alt={`${product.name} sabor coco`}
            aspect="can"
            tone="water"
            label="Sabor coco"
            className="mx-auto max-w-[280px] border-white/20 bg-white/10"
          />
        </Reveal>
      </Container>
    </section>
  );
}
