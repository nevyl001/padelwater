import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import { Providers } from "@/components/Providers";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Pádel Water — Hidratación para la cancha",
    template: "%s · Pádel Water",
  },
  description:
    "Pádel Water es hidratación con electrolitos orales, creada para jugadores de pádel. Sabor coco, 470 ml.",
  applicationName: "Pádel Water",
  authors: [{ name: "Pádel Water" }],
  creator: "Pádel Water",
  keywords: [
    "Pádel Water",
    "hidratación",
    "pádel",
    "electrolitos",
    "sabor coco",
    "bebida deportiva",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Pádel Water — Hidratación para la cancha",
    description:
      "Hidratación con electrolitos, creada para acompañarte antes, durante y después del partido.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Pádel Water",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pádel Water — Hidratación para la cancha",
    description:
      "Hidratación con electrolitos, creada para jugadores de pádel.",
    images: ["/twitter-image.png"],
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png" }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1F2754" },
    { media: "(prefers-color-scheme: dark)", color: "#0C1028" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans text-pw-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
