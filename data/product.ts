/**
 * Product data sourced only from packaging / confirmed brand info.
 * Do not invent nutrition facts, ingredients, or claims.
 */
export const product = {
  name: "Pádel Water",
  flavor: "Coco",
  flavorLabel: "Sabor coco",
  volume: "470 ml",
  claim: "Hydration for padel players",
  feature: "Con electrolitos orales",
  description:
    "Hidratación con electrolitos, creada para jugadores de pádel. Presentación de 470 ml con sabor coco.",
  // Future flavors can be added here without showing unavailable ones in UI
  flavors: [
    {
      id: "coco",
      name: "Coco",
      available: true,
      // Set path when final photography is delivered
      image: null as string | null,
    },
  ],
  media: {
    // Paths relative to /public — replace when assets arrive
    hero: null as string | null,
    front: null as string | null,
    coconut: null as string | null,
    detail: null as string | null,
  },
  information: {
    presentation: "Lata de 470 ml. Sabor coco. Con electrolitos orales.",
    ingredients: null as string | null,
    nutrition: null as string | null,
    recommendations: null as string | null,
    warnings: null as string | null,
  },
} as const;

export type Product = typeof product;
