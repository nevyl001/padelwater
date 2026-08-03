import { brandStatement } from "@/data/site-content";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { Container } from "@/components/ui/Container";

export function BrandStatement() {
  return (
    <section
      id="declaracion"
      className="relative bg-pw-ice section-pad anchor-offset"
      aria-label="Declaración de marca"
    >
      <Container className="max-w-5xl text-center">
        <SplitTextReveal
          lines={brandStatement.lines}
          className="text-editorial text-pw-navy"
          lineClassName="text-editorial text-pw-navy"
        />
      </Container>
    </section>
  );
}
