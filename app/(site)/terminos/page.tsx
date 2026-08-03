import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Términos",
  description: `Términos de uso de ${siteConfig.name}.`,
  alternates: { canonical: "/terminos" },
};

export default function TermsPage() {
  return (
    <main className="bg-pw-ice section-pad pt-[calc(var(--header-offset)+2rem)]">
      <div className="container-pw max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-pw-muted">
          Legal
        </p>
        <h1 className="mt-3 text-editorial text-pw-navy">Términos</h1>
        <div className="mt-10 space-y-5 text-pw-muted">
          <p>
            Los términos de uso definitivos de {siteConfig.name} se publicarán
            aquí. El contenido del sitio es informativo y no constituye una
            oferta comercial hasta que existan canales de venta confirmados.
          </p>
          <p>
            Las afirmaciones sobre el producto se limitan a la información
            disponible en el empaque y a lo confirmado por la marca.
          </p>
          <Link
            href="/"
            className="inline-block text-pw-navy underline-offset-4 hover:underline"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
