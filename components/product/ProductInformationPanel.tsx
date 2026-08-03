"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { product } from "@/data/product";
import { useFocusTrap } from "@/components/ui/Accordion";
import { durations, easings } from "@/lib/motion";

type ProductInformationPanelProps = {
  open: boolean;
  onClose: () => void;
};

function InfoBlock({
  title,
  value,
}: {
  title: string;
  value: string | null;
}) {
  return (
    <div className="border-t border-pw-ink/10 py-4">
      <h3 className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-pw-muted">
        {title}
      </h3>
      <p className="text-pw-ink">
        {value ?? "Información disponible cuando la marca la confirme."}
      </p>
    </div>
  );
}

export function ProductInformationPanel({
  open,
  onClose,
}: ProductInformationPanelProps) {
  const trapRef = useFocusTrap(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: durations.fast }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-pw-navy-deep/55 backdrop-blur-[2px]"
            aria-label="Cerrar información del producto"
            onClick={onClose}
          />
          <motion.div
            ref={trapRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-info-title"
            className="relative z-10 max-h-[85svh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-pw-white p-6 shadow-[var(--shadow-soft)] sm:rounded-2xl sm:p-8"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: durations.base, ease: easings.outExpo }}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-pw-muted">
                  Producto
                </p>
                <h2
                  id="product-info-title"
                  className="font-display text-3xl uppercase text-pw-navy"
                >
                  {product.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-10 w-10 place-items-center rounded-full border border-pw-ink/15 text-lg"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <InfoBlock
              title="Presentación"
              value={product.information.presentation}
            />
            <InfoBlock
              title="Ingredientes"
              value={product.information.ingredients}
            />
            <InfoBlock
              title="Información nutrimental"
              value={product.information.nutrition}
            />
            <InfoBlock
              title="Recomendaciones"
              value={product.information.recommendations}
            />
            <InfoBlock
              title="Advertencias"
              value={product.information.warnings}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
