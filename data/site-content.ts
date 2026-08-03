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
