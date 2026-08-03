import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: `Aviso de privacidad de ${siteConfig.name}.`,
  alternates: { canonical: "/aviso-de-privacidad" },
};

export default function PrivacyPage() {
  return (
    <main className="bg-pw-ice section-pad pt-[calc(var(--header-offset)+2rem)]">
      <div className="container-pw max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-pw-muted">
          Legal
        </p>
        <h1 className="mt-3 text-editorial text-pw-navy">
          Aviso de privacidad
        </h1>
        <div className="mt-10 space-y-5 text-pw-muted">
          <p>
            Este aviso se actualizará con la información legal definitiva de{" "}
            {siteConfig.name}. Mientras tanto, para cualquier consulta sobre
            datos personales, escríbenos a través de nuestros canales de
            contacto.
          </p>
          <p>
            No recopilamos información de usuarios a través de formularios en
            este sitio en su versión actual. El contacto se realiza mediante
            WhatsApp u otras redes oficiales.
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
