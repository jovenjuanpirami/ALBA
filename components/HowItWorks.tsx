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
      <Container className="py-10 sm:py-12">
        <ol className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} as="li" delay={i * 90}>
              <div className="flex items-baseline gap-4">
                <span className="num text-[11px] tracking-[0.16em] text-ember-deep">{step.n}</span>
                <div>
                  <p className="font-display text-lg font-normal tracking-tight text-ink">
                    {step.title}
                  </p>
                  <p className="mt-1 text-[14px] text-slate">{step.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
