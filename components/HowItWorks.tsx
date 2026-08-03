import { Reveal } from "./Reveal";
import { Container } from "./Section";

/** Los tres pasos, con el copy de la pregunta 1 del FAQ. Para que se entienda en 5 segundos. */
const STEPS = [
  { n: "01", title: "Un medidor", detail: "En 350 ml de agua fría." },
  { n: "02", title: "Shaker", detail: "Veinte segundos." },
  { n: "03", title: "Listo", detail: "450 kcal y 26 nutrientes." },
] as const;

export function HowItWorks() {
  return (
    <section className="border-b border-rule bg-paper-deep">
      <Container className="py-12 sm:py-14">
        <ol className="relative grid gap-10 sm:grid-cols-3 sm:gap-8">
          {/* Hilo que une los tres pasos. Solo en desktop, donde hay eje horizontal. */}
          <span
            aria-hidden="true"
            className="absolute top-1.75 right-0 left-0 hidden h-px bg-rule sm:block"
          />

          {STEPS.map((step, i) => (
            <Reveal key={step.n} as="li" delay={i * 110} className="relative">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 rounded-full border-[3px] border-paper-deep bg-ember"
                />
                <span className="num text-[11px] tracking-[0.16em] text-ember-deep">{step.n}</span>
              </div>

              <p className="font-display mt-4 text-xl font-normal tracking-tight text-ink">
                {step.title}
              </p>
              <p className="mt-1.5 text-[14px] text-slate">{step.detail}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
