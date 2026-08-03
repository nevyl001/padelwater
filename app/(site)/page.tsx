import { HeroScene } from "@/components/scenes/HeroScene";
import { ProductShowcaseScene } from "@/components/scenes/ProductShowcaseScene";
import { ConsumptionMomentsScene } from "@/components/scenes/ConsumptionMomentsScene";
import { EditorialParallaxScene } from "@/components/scenes/EditorialParallaxScene";
import { FlavorScene } from "@/components/scenes/FlavorScene";
import { AvailabilitySection } from "@/components/sections/AvailabilitySection";
import { FinalScene } from "@/components/scenes/FinalScene";
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
    </>
  );
}

/**
 * Narrative flow (one job per section):
 * Hero → Showcase → Moments → Editorial → Flavor → Availability → Final
 */
export default function HomePage() {
  return (
    <>
      <JsonLd />
      <main>
        <HeroScene />
        <ProductShowcaseScene />
        <ConsumptionMomentsScene />
        <EditorialParallaxScene />
        <FlavorScene />
        <AvailabilitySection />
        <FinalScene />
      </main>
    </>
  );
}
