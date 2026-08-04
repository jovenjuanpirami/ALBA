import Image from "next/image";
import founders from "@/media/founders.webp";
import { Reveal } from "./Reveal";
import { Container, Heading, SectionLabel } from "./Section";

export function Founders() {
  return (
    <section id="nosotros" className="scroll-mt-20 border-b border-rule py-16 sm:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <Image
              src={founders}
              alt="Nerea y Juan Pablo, fundadores de Alba"
              placeholder="blur"
              sizes="(min-width: 1024px) 460px, 92vw"
              className="w-full rounded-sm"
            />
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <SectionLabel index="04">Quiénes somos</SectionLabel>
              <Heading>Nerea y Juan Pablo.</Heading>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-7 space-y-5 text-[17px] leading-relaxed text-slate">
                <p>
                  Nerea da clases de pilates y tiene su propio estudio. Juan Pablo jugó futbol de
                  niño y hoy lleva Artu, una startup de software. Llevamos años armando el día
                  alrededor de entrenar y de trabajar.
                </p>
                <p>
                  El problema siempre fue el mismo: entre una clase temprano y una junta a las
                  nueve, el desayuno es lo primero que se cae.
                </p>
                <p className="border-l border-ember pl-5 text-ink">
                  Alba es lo que estamos construyendo para cerrar ese hueco. No hay una red detrás
                  ni un club al que entrar: somos nosotros dos, haciendo el desayuno que nos hacía
                  falta a los dos.
                </p>
              </div>

              <p className="label-mono mt-8">Nerea y Juan Pablo · Fundadores</p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
