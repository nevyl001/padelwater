/**
 * Product data sourced from official packaging / confirmed brand info.
 */
export const product = {
  name: "Pádel Water",
  flavor: "Coco",
  flavorLabel: "Sabor coco",
  volume: "470 ml",
  claim: "Hydration for padel players",
  feature: "Con electrolitos orales",
  description:
    "Hidratación con electrolitos orales, creada para jugadores de pádel. Presentación de 470 ml. Sabor coco.",
  flavors: [
    {
      id: "coco",
      name: "Coco",
      available: true,
      image: "/product/can-front.webp" as string | null,
    },
  ],
  media: {
    hero: "/product/can-hero.webp" as string | null,
    front: "/product/can-front.webp" as string | null,
    coconut: "/product/can-detail.webp" as string | null,
    detail: "/product/can-detail.webp" as string | null,
    label: "/product/label.webp" as string | null,
  },
  information: {
    presentation:
      "Lata de 470 ml. Sabor coco. Con electrolitos orales.",
    ingredients: "Agua con electrolitos y minerales." as string | null,
    nutrition: "0 g de azúcar. Sin cafeína." as string | null,
    recommendations: null as string | null,
    warnings: null as string | null,
  },
} as const;

export type Product = typeof product;
