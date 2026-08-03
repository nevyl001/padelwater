import { finalCta } from "@/data/site-content";
import { ProductCan } from "@/components/product/ProductCan";
import { Container } from "@/components/ui/Container";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { DotPattern } from "@/components/ui/DotPattern";
import { Reveal } from "@/components/motion/Reveal";

export function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden bg-pw-navy-deep section-pad text-pw-white grain"
      aria-label="Llamado a la acción"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-1/2 h-[120%] w-[55%] -translate-y-1/2 opacity-90"
      >
        <div className="absolute inset-0 rounded-full bg-pw-lime/15 blur-3xl" />
        <ProductCan
          className="absolute left-1/2 top-1/2 max-w-[360px] -translate-x-[20%] -translate-y-1/2 scale-125"
          showReflection={false}
          tone="navy"
        />
      </div>
      <DotPattern className="bottom-0 left-0 h-56 w-56 opacity-50" />

      <Container className="relative z-10 max-w-2xl">
        <Reveal>
          <h2 className="text-editorial">{finalCta.title}</h2>
          <div className="mt-10">
            <WhatsAppLink size="lg" magnetic>
              {finalCta.button}
            </WhatsAppLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
