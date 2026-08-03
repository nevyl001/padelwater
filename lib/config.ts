/**
 * Central site configuration.
 * Update WhatsApp number and default message without touching components.
 */
export const siteConfig = {
  name: "Pádel Water",
  tagline: "Hydration for padel players",
  url: "https://padelwater.com",
  locale: "es_MX",
  social: {
    // Update when official handles are confirmed
    instagram: "https://instagram.com/padelwater",
    tiktok: "https://tiktok.com/@padelwater",
  },
  whatsapp: {
    /** Digits only, country code included. Replace with definitive number. */
    number: "5210000000000",
    message:
      "Hola, quiero conocer más sobre Pádel Water y saber cómo puedo probarla.",
    availabilityMessage:
      "Hola, quiero preguntar por disponibilidad de Pádel Water.",
  },
} as const;
