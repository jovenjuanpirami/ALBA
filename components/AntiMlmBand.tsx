import { Reveal } from "./Reveal";
import { Container } from "./Section";

/** Banda compacta en tinta. Era una sección completa; como banda dice lo mismo en un tercio. */
export function AntiMlmBand() {
  return (
    <section className="bg-ink py-14 text-paper sm:py-16">
      <Container>
        <Reveal className="grid gap-8 md:grid-cols-12 md:items-end">
          <h2 className="text-[clamp(1.75rem,4.5vw,2.75rem)] leading-[1.04] font-light tracking-tight text-paper md:col-span-6">
            Sin coaches. Sin clubes. Sin niveles.
          </h2>
          <p className="text-[15px] leading-relaxed text-paper/65 md:col-span-6 md:col-start-7">
            Compras directo, al precio que ves. No hay red, no hay upline, no hay que reclutar a
            nadie. La fórmula completa está publicada arriba porque no tenemos nada que esconder.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
