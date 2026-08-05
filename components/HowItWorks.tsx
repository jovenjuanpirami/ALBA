import Image from "next/image";
import scoop from "@/media/scoop.webp";
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
    <section className="bg-paper-deep">
      <Container className="py-14 sm:py-16">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
          <Reveal className="md:col-span-5 lg:col-span-4">
            {/* El fondo del render es casi idéntico a paper-deep: el medidor flota. */}
            <Image
              src={scoop}
              alt="Medidor negro con una porción de polvo de Alba"
              placeholder="blur"
              sizes="(min-width: 768px) 380px, 70vw"
              className="mx-auto w-full max-w-75 md:max-w-none"
            />
          </Reveal>

          <ol className="relative md:col-span-7 lg:col-span-7 lg:col-start-6">
            {/* Hilo vertical que une los tres pasos. */}
            <span
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-1.25 w-px bg-rule"
            />

            {STEPS.map((step, i) => (
              <Reveal
                key={step.n}
                as="li"
                delay={i * 110}
                className={`relative pl-8 ${i === 0 ? "" : "pt-8"}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-0 h-2.5 w-2.5 rounded-full bg-ember ring-4 ring-paper-deep ${
                    i === 0 ? "top-2" : "top-10"
                  }`}
                />
                <div className="flex items-baseline gap-3">
                  <span className="num text-[11px] tracking-[0.16em] text-ember-deep">{step.n}</span>
                  <p className="font-display text-2xl text-ink sm:text-2xl">
                    {step.title}
                  </p>
                </div>
                <p className="mt-1.5 text-[15px] text-slate">{step.detail}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
