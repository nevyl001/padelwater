import { footerContent, navigation } from "@/data/site-content";
import { siteConfig } from "@/lib/config";
import { Wordmark } from "@/components/ui/Wordmark";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-pw-navy-deep text-pw-white">
      <Container className="section-pad !py-16 md:!py-20">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Wordmark tone="light" />
            <p className="mt-4 max-w-sm text-sm text-white/60">
              {siteConfig.tagline}
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-white/45">
              Navegación
            </p>
            <ul className="space-y-3 text-sm text-white/75">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-white/45">
              Contacto
            </p>
            <ul className="space-y-3 text-sm text-white/75">
              <li>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  TikTok
                </a>
              </li>
              {footerContent.legal.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-14 border-t border-white/10 pt-6 text-xs text-white/40">
          {footerContent.rights}
        </p>
      </Container>
    </footer>
  );
}
