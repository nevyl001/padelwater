import { HeroScene } from "@/components/scenes/HeroScene";
import { ProductStoryScene } from "@/components/scenes/ProductStoryScene";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { CoconutSection } from "@/components/sections/CoconutSection";
import { CourtScene } from "@/components/scenes/CourtScene";
import { CommunityScene } from "@/components/scenes/CommunityScene";
import { ProductShowcaseScene } from "@/components/scenes/ProductShowcaseScene";
import { AvailabilitySection } from "@/components/sections/AvailabilitySection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalScene } from "@/components/scenes/FinalScene";
import { faqItems } from "@/data/faq";
import { product } from "@/data/product";
import { siteConfig } from "@/lib/config";

function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    sameAs: [siteConfig.social.instagram, siteConfig.social.tiktok],
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.name,
    },
    category: "Bebida de hidratación",
    size: product.volume,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <main>
        {/* Escena 1: Hero */}
        <HeroScene />
        {/* Escena 2: Product Story */}
        <ProductStoryScene />
        <BrandStatement />
        <BenefitsSection />
        <CoconutSection />
        {/* Escena 4: Court */}
        <CourtScene />
        {/* Escena 5: Community */}
        <CommunityScene />
        {/* Escena 3: Product Showcase */}
        <ProductShowcaseScene />
        <AvailabilitySection />
        <FAQSection />
        {/* Escena 6: Final */}
        <FinalScene />
      </main>
    </>
  );
}
