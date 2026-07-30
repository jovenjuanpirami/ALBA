"use client";

import { useState } from "react";
import { track } from "@/lib/track";
import { Reveal } from "./Reveal";
import { Container, SectionLabel } from "./Section";

const QUESTIONS = [
  {
    id: "preparacion",
    q: "¿Cómo se prepara?",
    a: "Un medidor en 350 ml de agua fría. Shaker, veinte segundos. También funciona con leche de almendra si prefieres.",
  },
  {
    id: "duracion",
    q: "¿Cuánto dura una bolsa?",
    a: "Veinte porciones. Si desayunas Alba de lunes a viernes, te dura un mes.",
  },
  {
    id: "sustituye",
    q: "¿Sustituye una comida?",
    a: "Alba es un suplemento alimenticio que aporta 450 kcal y 26 nutrientes al 30% de tu VNR diario. Está diseñado para ser tu primera comida del día como parte de una dieta variada.",
  },
  {
    id: "sabor",
    q: "¿A qué sabe?",
    a: "Hay dos sabores, chocolate y vainilla, con la misma fórmula. Están formulados para el paladar mexicano: dulce moderado, sin regusto metálico.",
  },
  {
    id: "lactosa",
    q: "¿Tiene lactosa?",
    a: "Usa aislado de proteína de suero, con menos de 1% de lactosa. La mayoría de personas con intolerancia lo toleran bien. La versión 100% vegetal llega después.",
  },
  {
    id: "precio",
    q: "¿Por qué cuesta más por porción que una proteína?",
    a: "Porque no es una proteína. Una proteína aporta 25 gramos de proteína. Alba aporta una comida completa: proteína, carbohidrato de bajo índice glucémico, grasas, fibra y 26 micronutrientes dosificados.",
  },
  {
    id: "mexicano",
    q: "¿Es mexicano?",
    a: "Sí. Formulado en México contra el Valor Nutrimental de Referencia mexicano y fabricado en México.",
  },
  {
    id: "envio",
    q: "¿Cuándo llega mi pedido?",
    a: "Estamos en preventa. Registra tu correo y te avisamos la fecha exacta de envío antes de cobrarte nada.",
  },
] as const;

export function Faq() {
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpen((current) => {
      if (current === id) return null;
      track("faq_open", { question_id: id });
      return id;
    });
  };

  return (
    <section className="border-b border-rule py-16 sm:py-24">
      <Container>
        <Reveal>
          <SectionLabel index="07">Preguntas</SectionLabel>
        </Reveal>

        <div className="border-t border-ink">
          {QUESTIONS.map((item, i) => {
            const isOpen = open === item.id;
            return (
              <Reveal key={item.id} delay={Math.min(i, 4) * 70}>
                <div className="border-b border-rule">
                  <h3>
                    <button
                      type="button"
                      onClick={() => toggle(item.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${item.id}`}
                      id={`faq-button-${item.id}`}
                      className="group flex w-full items-baseline justify-between gap-6 py-5 text-left"
                    >
                      <span
                        className={`max-w-2xl text-[16px] font-medium transition-colors duration-200 sm:text-[17px] ${
                          isOpen ? "text-ink" : "text-ink group-hover:text-ember-deep"
                        }`}
                      >
                        {item.q}
                      </span>
                      <span
                        aria-hidden="true"
                        className="relative mt-2 h-3 w-3 shrink-0"
                      >
                        <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-ember" />
                        <span
                          className={`absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-ember transition-transform duration-300 ${
                            isOpen ? "scale-y-0" : "scale-y-100"
                          }`}
                        />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-button-${item.id}`}
                    hidden={!isOpen}
                    className="max-w-2xl pb-6 text-[15px] leading-relaxed text-slate"
                  >
                    {item.a}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
