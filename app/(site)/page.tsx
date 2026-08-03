import { HeroSection } from "@/components/sections/HeroSection";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { ProductStory } from "@/components/sections/ProductStory";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { CoconutSection } from "@/components/sections/CoconutSection";
import { ConsumptionMoments } from "@/components/sections/ConsumptionMoments";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { ProductDetails } from "@/components/sections/ProductDetails";
import { AvailabilitySection } from "@/components/sections/AvailabilitySection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
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
        <HeroSection />
        <BrandStatement />
        <ProductStory />
        <BenefitsSection />
        <CoconutSection />
        <ConsumptionMoments />
        <CommunitySection />
        <ProductDetails />
        <AvailabilitySection />
        <FAQSection />
        <FinalCTA />
      </main>
    </>
  );
}
