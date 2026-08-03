"use client";

import { consumptionMoments } from "@/data/site-content";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

const accents = [
  "border-pw-navy bg-pw-navy text-pw-white",
  "border-pw-cyan bg-pw-cyan text-pw-white",
  "border-pw-lime bg-pw-lime text-pw-navy-deep",
] as const;

/**
 * Compact consumption sequence — three brief moments on one trajectory.
 * Not a second features list and not three full-viewport cards.
 */
export function ConsumptionMomentsScene() {
  return (
    <section
      id="momentos"
      data-scene="consumption-moments"
      className="relative bg-pw-ice py-16 md:py-20"
      aria-label="Momentos de consumo"
    >
      <Container>
        <Reveal>
          <SectionLabel>Momento de consumo</SectionLabel>
          <h2 className="mt-3 max-w-2xl text-section text-pw-navy">
            Antes. Durante. Después.
          </h2>
        </Reveal>

        <div className="relative mt-10 md:mt-12">
          {/* Continuous trajectory line */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-[1.15rem] hidden h-px bg-pw-ink/15 md:block"
          />

          <ol className="grid gap-6 md:grid-cols-3 md:gap-8">
            {consumptionMoments.map((moment, index) => (
              <Reveal key={moment.id} delay={index * 70}>
                <li className="relative">
                  <div className="mb-4 flex items-center gap-3 md:mb-5">
                    <span
                      className={cn(
                        "relative z-10 grid h-9 w-9 place-items-center rounded-full border text-[0.65rem] font-bold tracking-wide",
                        accents[index],
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[0.7rem] uppercase tracking-[0.22em] text-pw-muted">
                      {moment.label}
                    </p>
                  </div>
                  <p className="max-w-xs text-base leading-relaxed text-pw-ink/80 md:text-lg">
                    {moment.text}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
