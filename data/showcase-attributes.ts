/**
 * Real product attributes for the interactive showcase.
 * Single home for specs — copy from confirmed product/site content only.
 */
export const showcaseAttributes = [
  {
    id: "hidratacion",
    label: "Hidratación",
    eyebrow: "En cada punto",
    title: "Hidratación",
    text: "Pensada para el ritmo de la cancha: fresca, clara y lista en cada set.",
    tone: "navy" as const,
    canTone: "navy" as const,
  },
  {
    id: "electrolitos",
    label: "Electrolitos",
    eyebrow: "Lo esencial",
    title: "Electrolitos orales",
    text: "Tal como lo indica el empaque: claridad para seguir compitiendo.",
    tone: "navy" as const,
    canTone: "navy" as const,
  },
  {
    id: "coco",
    label: "Sabor coco",
    eyebrow: "El sabor",
    title: "Sabor coco",
    text: "Coco ligero y limpio, sin robarte el foco del partido.",
    tone: "water" as const,
    canTone: "water" as const,
  },
  {
    id: "formato",
    label: "470 ml",
    eyebrow: "Tu formato",
    title: "470 ml",
    text: "El tamaño justo del calentamiento al último punto.",
    tone: "ice" as const,
    canTone: "ice" as const,
  },
  {
    id: "cancha",
    label: "En cancha",
    eyebrow: "El juego",
    title: "En la cancha",
    text: "Nace del juego en comunidad: partidos y la energía que se pasa de mano en mano.",
    tone: "navy" as const,
    canTone: "navy" as const,
  },
] as const;

export type ShowcaseAttribute = (typeof showcaseAttributes)[number];
