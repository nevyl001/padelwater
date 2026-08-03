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
 * Compact consumption sequence — three beats on one line.
 */
export function ConsumptionMomentsScene() {
  return (
    <section
      id="momentos"
      data-scene="consumption-moments"
      className="relative bg-pw-ice py-12 md:py-14"
      aria-label="Momentos de consumo"
    >
      <Container>
        <Reveal>
          <SectionLabel className="tracking-[0.26em]">Momento de consumo</SectionLabel>
          <h2 className="mt-3.5 max-w-2xl text-section text-pw-navy">
            Antes. Durante. Después.
          </h2>
        </Reveal>

        <div className="relative mt-9 md:mt-11">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[1.125rem] right-[1.125rem] top-[1.125rem] hidden h-px bg-pw-navy/12 md:block"
          />

          <ol className="grid gap-8 md:grid-cols-3 md:gap-10">
            {consumptionMoments.map((moment, index) => (
              <Reveal key={moment.id} delay={index * 60}>
                <li className="relative">
                  <div className="mb-3.5 flex items-center gap-3">
                    <span
                      className={cn(
                        "relative z-10 grid h-9 w-9 place-items-center rounded-full border text-[0.62rem] font-bold tracking-[0.06em]",
                        accents[index],
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-pw-navy/55">
                      {moment.label}
                    </p>
                  </div>
                  <p className="max-w-[18rem] text-[0.98rem] leading-relaxed text-pw-navy/80 md:text-base">
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
