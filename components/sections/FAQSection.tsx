"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { LayoutGroup } from "motion/react";
import { faqItems } from "@/data/faq";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/motion/TextReveal";
import { FAQItem } from "@/components/sections/FAQItem";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusItem = (index: number) => {
    const clamped = (index + faqItems.length) % faqItems.length;
    buttonRefs.current[clamped]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusItem(index + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusItem(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusItem(0);
        break;
      case "End":
        event.preventDefault();
        focusItem(faqItems.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <section
      id="faq"
      data-section="faq"
      className="bg-pw-white section-pad anchor-offset"
      aria-label="Preguntas frecuentes"
    >
      <Container className="max-w-3xl">
        <SectionLabel>Preguntas</SectionLabel>
        <TextReveal
          as="h2"
          variant="editorial"
          text="Lo esencial, claro."
          splitBy="words"
          className="mt-4 text-pw-navy"
        />

        <LayoutGroup>
          <div className="mt-14 flex flex-col gap-3">
            {faqItems.map((item, index) => (
              <FAQItem
                key={item.question}
                index={index}
                item={item}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                buttonRef={(el) => {
                  buttonRefs.current[index] = el;
                }}
              />
            ))}
          </div>
        </LayoutGroup>
      </Container>
    </section>
  );
}
