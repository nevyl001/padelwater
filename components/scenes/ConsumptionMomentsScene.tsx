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
 * Compact consumption sequence — three equal beats across the full width.
 */
export function ConsumptionMomentsScene() {
  return (
    <section
      id="momentos"
      data-scene="consumption-moments"
      className="relative bg-pw-ice py-16 md:py-24"
      aria-label="Momentos de consumo"
    >
      <Container>
        <Reveal>
          <SectionLabel>Momento de consumo</SectionLabel>
          <h2 className="mt-3.5 max-w-2xl text-section text-pw-navy md:mt-4">
            Antes. Durante. Después.
          </h2>
        </Reveal>

        <div className="relative mt-10 md:mt-14">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[1.125rem] right-[1.125rem] top-[1.125rem] hidden h-px bg-pw-navy/12 md:block"
          />

          <ul className="grid w-full list-none grid-cols-1 gap-10 p-0 md:grid-cols-3 md:gap-8 lg:gap-12">
            {consumptionMoments.map((moment, index) => (
              <li key={moment.id} className="relative min-w-0 w-full">
                <Reveal delay={index * 60} className="w-full">
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className={cn(
                        "relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border text-[0.62rem] font-bold tracking-[0.06em]",
                        accents[index],
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[0.8rem] font-semibold uppercase tracking-[0.26em] text-pw-navy/70 md:text-[0.88rem]">
                      {moment.label}
                    </p>
                  </div>
                  <p className="text-[1.05rem] leading-relaxed text-pw-navy/80 md:text-lg md:leading-relaxed">
                    {moment.text}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
