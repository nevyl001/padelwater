export const navigation = [
  { label: "Producto", href: "#producto" },
  { label: "Momentos", href: "#momentos" },
  { label: "Sabor", href: "#sabor" },
  { label: "Dónde encontrarla", href: "#donde" },
] as const;

export const heroContent = {
  eyebrow: "Para la cancha",
  titleLines: ["Juega fresco.", "Llega más lejos."],
  description:
    "Pádel Water nace del juego: creada para acompañarte en cada partido.",
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
    eyebrow: "En cada punto",
    text: "Frescura que acompaña cuando el set se alarga y el ritmo no perdona.",
    tone: "navy" as const,
    layout: "backdrop" as const,
  },
  {
    id: "electrolitos",
    label: "Con electrolitos",
    eyebrow: "Lo esencial",
    text: "Electrolitos orales en cada sorbo: claridad para seguir compitiendo.",
    tone: "navy" as const,
    layout: "side" as const,
  },
  {
    id: "coco",
    label: "Sabor coco",
    eyebrow: "El sabor",
    text: "Coco ligero y limpio. Frescura que se siente sin robarte el foco.",
    tone: "water" as const,
    layout: "open" as const,
  },
  {
    id: "formato",
    label: "470 ml",
    eyebrow: "Tu formato",
    text: "El tamaño justo para acompañarte del calentamiento al último punto.",
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
  title: "Desde el primer punto.",
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
  text: "Pádel Water nace del juego en comunidad: partidos, rivales que se vuelven equipo y lo que se pasa de mano en mano.",
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
