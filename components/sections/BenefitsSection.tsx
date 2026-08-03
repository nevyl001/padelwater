import { benefits } from "@/data/site-content";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { DotPattern } from "@/components/ui/DotPattern";
import { Reveal } from "@/components/motion/Reveal";

export function BenefitsSection() {
  return (
    <section
      id="por-que"
      className="relative overflow-hidden bg-pw-white section-pad anchor-offset"
      aria-label="Beneficios"
    >
      <DotPattern
        className="right-0 top-10 h-48 w-48 opacity-50"
        color="cyan"
      />
      <Container>
        <Reveal>
          <SectionLabel>Por qué Pádel Water</SectionLabel>
          <h2 className="mt-4 max-w-3xl text-editorial text-pw-navy">
            Hidratación con carácter de cancha.
          </h2>
        </Reveal>

        <div className="mt-16 space-y-16 md:mt-24 md:space-y-24">
          {benefits.map((item, index) => (
            <Reveal key={item.index} delay={index * 80}>
              <article className="grid items-end gap-6 border-t border-pw-ink/10 pt-10 md:grid-cols-[0.35fr_1fr_1.1fr] md:gap-10">
                <p className="font-display text-5xl text-pw-lime md:text-7xl">
                  {item.index}
                </p>
                <h3 className="text-section text-pw-navy">{item.title}</h3>
                <p className="max-w-xl text-body-lg text-pw-muted">
                  {item.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
