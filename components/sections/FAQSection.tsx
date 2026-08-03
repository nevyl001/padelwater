import { faqItems } from "@/data/faq";
import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";

export function FAQSection() {
  return (
    <section
      id="faq"
      className="bg-pw-white section-pad anchor-offset"
      aria-label="Preguntas frecuentes"
    >
      <Container className="max-w-3xl">
        <Reveal>
          <SectionLabel>Preguntas</SectionLabel>
          <h2 className="mt-4 text-editorial text-pw-navy">
            Lo esencial, claro.
          </h2>
        </Reveal>
        <div className="mt-10">
          <Accordion items={faqItems} />
        </div>
      </Container>
    </section>
  );
}
