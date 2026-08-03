import { siteConfig } from "@/lib/config";

export function buildWhatsAppUrl(message?: string): string {
  const text = encodeURIComponent(message ?? siteConfig.whatsapp.message);
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${text}`;
}
