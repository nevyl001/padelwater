/**
 * Availability source of truth.
 * Switch `mode` when clubs, map, distributors, or ecommerce go live.
 */
export type AvailabilityMode =
  | "coming_soon"
  | "clubs"
  | "map"
  | "distributors"
  | "ecommerce";

export type Club = {
  id: string;
  name: string;
  city: string;
  url?: string;
};

export type Distributor = {
  id: string;
  name: string;
  region: string;
  contact?: string;
};

export const availability = {
  mode: "coming_soon" as AvailabilityMode,
  eyebrow: "Dónde encontrarla",
  title: "Muy pronto en más canchas.",
  description:
    "Pádel Water está llegando a la comunidad. Pregúntanos por disponibilidad y te orientamos.",
  ctaLabel: "Pregunta por disponibilidad",
  // Populated when real partners are confirmed — never invent entries
  clubs: [] as Club[],
  distributors: [] as Distributor[],
  ecommerceUrl: null as string | null,
  mapEmbedUrl: null as string | null,
} as const;
