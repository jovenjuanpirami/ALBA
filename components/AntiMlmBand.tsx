import { Reveal } from "./Reveal";
import { Container } from "./Section";

/** Panel en tinta con esquinas suaves, no una banda a sangre: pesa menos y se ve más nuevo. */
export function AntiMlmBand() {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Reveal>
          <div className="grid gap-8 rounded-xl bg-ink px-7 py-14 text-paper sm:px-12 sm:py-16 md:grid-cols-12 md:items-end">
            <h2 className="text-[clamp(1.875rem,4.5vw,3rem)] text-paper md:col-span-6">
              Sin coaches. Sin clubes. Sin niveles.
            </h2>
            <p className="text-[16px] leading-relaxed text-paper/65 md:col-span-5 md:col-start-8">
              Compras directo, al precio que ves. No hay red, no hay upline, no hay que reclutar a
              nadie. La fórmula completa está publicada arriba porque no tenemos nada que esconder.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
