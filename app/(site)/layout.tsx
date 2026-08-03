import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#contenido"
        className="fixed left-4 top-4 z-[80] -translate-y-20 rounded-full bg-pw-lime px-4 py-2 text-sm font-medium text-pw-navy-deep opacity-0 focus:translate-y-0 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pw-lime"
      >
        Saltar al contenido
      </a>
      <Header />
      <div id="contenido">{children}</div>
      <Footer />
    </>
  );
}
