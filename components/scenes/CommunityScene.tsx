import { communitySection } from "@/data/site-content";
import { Container } from "@/components/ui/Container";
import { TextReveal } from "@/components/motion/TextReveal";

/**
 * Community statement — standalone (not orchestrated with neighboring
 * scenes), so it uses MaskReveal's "auto" mode directly: no dedicated
 * timeline hook needed, just the shared reveal system triggered on
 * scroll-into-view.
 */
export function CommunityScene() {
  const band = "La cancha se comparte · La energía también · ";

  return (
    <section
      data-scene="community"
      className="relative overflow-hidden bg-pw-navy section-pad text-pw-white"
      aria-label="Comunidad"
    >
      <Container className="relative z-10 max-w-4xl text-center">
        <TextReveal
          as="h2"
          variant="editorial"
          lines={communitySection.titleLines}
        />
        <TextReveal
          as="p"
          variant="bodyLg"
          text={communitySection.text}
          splitBy="words"
          className="mx-auto mt-8 max-w-2xl text-white/70"
        />
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
