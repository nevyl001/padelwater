import { communitySection } from "@/data/site-content";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Community section without stock photography.
 * When lifestyle images arrive, add them under public/brand/lifestyle
 * and render a slow marquee that respects prefers-reduced-motion.
 */
export function CommunitySection() {
  const band = "La cancha se comparte · La energía también · ";

  return (
    <section
      className="relative overflow-hidden bg-pw-navy section-pad text-pw-white"
      aria-label="Comunidad"
    >
      <Container className="relative z-10 max-w-4xl text-center">
        <Reveal>
          <h2 className="text-editorial">
            {communitySection.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-body-lg text-white/70">
            {communitySection.text}
          </p>
        </Reveal>
      </Container>

      <div
        aria-hidden
        className="pointer-events-none mt-16 overflow-hidden border-y border-white/10 py-5"
      >
        <div className="flex w-max gap-12 whitespace-nowrap text-xs uppercase tracking-[0.28em] text-white/35 animate-marquee">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>{band}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
