import { availability } from "@/data/availability";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { siteConfig } from "@/lib/config";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Availability architecture:
 * - coming_soon (current)
 * - clubs | map | distributors | ecommerce (future — switch mode in data/availability.ts)
 */
export function AvailabilitySection() {
  return (
    <section
      id="donde"
      className="bg-pw-ice py-16 anchor-offset md:py-20"
      aria-label="Disponibilidad"
    >
      <Container className="max-w-3xl">
        <Reveal>
          <SectionLabel>{availability.eyebrow}</SectionLabel>
          <h2 className="mt-4 text-editorial text-pw-navy">
            {availability.title}
          </h2>
          <p className="mt-6 max-w-xl text-body-lg text-pw-muted">
            {availability.description}
          </p>

          {availability.mode === "coming_soon" ? (
            <div className="mt-10">
              <WhatsAppLink
                message={siteConfig.whatsapp.availabilityMessage}
                size="lg"
                magnetic
              >
                {availability.ctaLabel}
              </WhatsAppLink>
            </div>
          ) : null}

          {/* Future modes render here without rewriting the section shell */}
          {availability.mode === "clubs" && availability.clubs.length > 0 ? (
            <ul className="mt-10 space-y-4">
              {availability.clubs.map((club) => (
                <li
                  key={club.id}
                  className="border-t border-pw-ink/10 pt-4 text-pw-ink"
                >
                  <p className="font-medium">{club.name}</p>
                  <p className="text-sm text-pw-muted">{club.city}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </Reveal>
      </Container>
    </section>
  );
}
