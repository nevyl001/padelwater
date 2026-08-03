export const navigation = [
  { label: "Producto", href: "#producto" },
  { label: "Por qué Pádel Water", href: "#por-que" },
  { label: "Sabor", href: "#sabor" },
  { label: "Dónde encontrarla", href: "#donde" },
] as const;

export const heroContent = {
  eyebrow: "Hidratación para la cancha",
  titleLines: ["Juega fresco.", "Llega más lejos."],
  description:
    "Pádel Water es hidratación con electrolitos, creada para acompañarte antes, durante y después del partido.",
  primaryCta: "Descubre Pádel Water",
  primaryHref: "#producto",
  secondaryCta: "Conoce el sabor coco",
  secondaryHref: "#sabor",
} as const;

export const brandStatement = {
  lines: [
    "No es otra bebida deportiva.",
    "Es hidratación pensada para quienes viven dentro de la cancha.",
  ],
} as const;

export const productStoryStages = [
  {
    id: "hidratacion",
    label: "Hidratación",
    eyebrow: "Para la cancha",
    text: "Electrolitos para acompañar el ritmo del partido.",
    tone: "navy" as const,
    layout: "backdrop" as const,
  },
  {
    id: "electrolitos",
    label: "Con electrolitos",
    eyebrow: "En el empaque",
    text: "Con electrolitos orales, tal como lo indica la lata.",
    tone: "navy" as const,
    layout: "side" as const,
  },
  {
    id: "coco",
    label: "Sabor coco",
    eyebrow: "Frescura",
    text: "Sabor coco, ligero y directo.",
    tone: "water" as const,
    layout: "open" as const,
  },
  {
    id: "formato",
    label: "470 ml",
    eyebrow: "Presentación",
    text: "Una presentación lista para acompañar cada encuentro.",
    tone: "lime-soft" as const,
    layout: "monument" as const,
  },
] as const;

export const benefits = [
  {
    index: "01",
    title: "Hidratación",
    description:
      "Una bebida pensada para el ritmo de la cancha: fresca, clara y lista para acompañarte en cada set.",
  },
  {
    index: "02",
    title: "Electrolitos",
    description:
      "Con electrolitos orales, tal como lo indica el empaque, para acompañar tu hidratación de juego.",
  },
  {
    index: "03",
    title: "Sabor refrescante",
    description:
      "Sabor coco ligero y directo: frescura que se siente sin distraerte del partido.",
  },
] as const;

export const coconutSection = {
  eyebrow: "Sabor coco",
  title: "Frescura que se siente desde el primer punto.",
  text: "Un sabor ligero pensado para acompañar el juego sin distraerte de él.",
} as const;

export const consumptionMoments = [
  {
    id: "antes",
    label: "Antes",
    text: "Llega a la cancha fresco y listo para el primer saque.",
  },
  {
    id: "durante",
    label: "Durante",
    text: "Acompaña el ritmo del partido entre puntos y cambios de lado.",
  },
  {
    id: "despues",
    label: "Después",
    text: "Cierra el encuentro con la misma frescura con la que empezaste.",
  },
] as const;

export const communitySection = {
  titleLines: ["La cancha se comparte.", "La energía también."],
  text: "Pádel Water nace del juego en comunidad: partidos, rivales que se vuelven equipo y la frescura que se pasa de mano en mano.",
} as const;

export const finalCta = {
  title: "Tu próximo partido empieza fresco.",
  button: "Quiero probar Pádel Water",
} as const;

export const headerCta = {
  label: "Quiero probarla",
} as const;

export const footerContent = {
  rights: `© ${new Date().getFullYear()} Pádel Water. Todos los derechos reservados.`,
  legal: [
    { label: "Aviso de privacidad", href: "/aviso-de-privacidad" },
    { label: "Términos", href: "/terminos" },
  ],
} as const;
