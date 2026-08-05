import Image from "next/image";
import founders from "@/media/founders.webp";
import { Reveal } from "./Reveal";
import { Container, Heading, SectionLabel } from "./Section";

export function Founders() {
  return (
    <section id="nosotros" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <div className="overflow-hidden rounded-lg shadow-soft">
              <Image
                src={founders}
                alt="Nerea y Juan Pablo, fundadores de Alba"
                placeholder="blur"
                sizes="(min-width: 1024px) 460px, 92vw"
                className="drift w-full"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <SectionLabel index="04">Quiénes somos</SectionLabel>
              <Heading>Nerea y Juan Pablo.</Heading>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-slate">
                <p>
                  Somos novios, y llevamos años armando el día alrededor de las mismas dos cosas:
                  entrenar y trabajar. Nerea da clases de pilates y tiene su propio estudio. Juan
                  Pablo jugó futbol desde niño y hoy lleva Artu, una startup de software.
                </p>
                <p>
                  Cuidamos mucho cómo nos movemos. Lo que nunca nos salió fue la comida: cuando la
                  mañana viene apretada, el desayuno es lo primero que se cae. Si te pasa, ya sabes
                  que no es por flojera. Es que no cabe.
                </p>
                <p className="text-ink">
                  Alba es lo que estamos construyendo para cerrar ese hueco, primero para nosotros.
                  No hay una red detrás ni un club al que entrar: somos los dos haciendo el desayuno
                  que nos hacía falta, para gente que vive como nosotros — con trabajo, ejercicio,
                  familia y amigos, todo el mismo día.
                </p>
              </div>

              <p className="label-mono mt-9">Nerea y Juan Pablo · Fundadores de Alba</p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
