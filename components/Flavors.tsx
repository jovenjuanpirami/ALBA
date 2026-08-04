"use client";

import Image, { type StaticImageData } from "next/image";
import ingredientsChocolate from "@/media/ingredients-chocolate.webp";
import ingredientsVainilla from "@/media/ingredients-vainilla.webp";
import lifestyleChocolate from "@/media/lifestyle-chocolate.webp";
import lifestyleVainilla from "@/media/lifestyle-vainilla.webp";
import { FLAVORS, getFlavor, type Flavor } from "@/lib/product";
import { FlavorToggle } from "./FlavorToggle";
import { Reveal } from "./Reveal";
import { Container, Heading, SectionLabel } from "./Section";
import { useStore } from "./Store";

const IMAGES: Record<
  Flavor,
  { lifestyle: StaticImageData; ingredients: StaticImageData; alt: string; altIngredients: string }
> = {
  vainilla: {
    lifestyle: lifestyleVainilla,
    ingredients: ingredientsVainilla,
    alt: "Alba Vainilla preparado en un vaso, junto a la bolsa y unos tenis en una terraza",
    altIngredients: "Bolsa de Alba Vainilla con avena, proteína, linaza y chía sobre pizarra",
  },
  chocolate: {
    lifestyle: lifestyleChocolate,
    ingredients: ingredientsChocolate,
    alt: "Alba Chocolate preparado en un vaso, junto a la bolsa y unos tenis en una terraza",
    altIngredients: "Bolsa de Alba Chocolate con avena, cacao, linaza y chía sobre pizarra",
  },
};

/** Las dos imágenes viven apiladas y hacen cross-fade: el sabor se cambia, no se recarga. */
function CrossFade({
  active,
  ratio,
  sizes,
  pick,
}: {
  active: Flavor;
  ratio: string;
  sizes: string;
  pick: (flavor: Flavor) => { src: StaticImageData; alt: string };
}) {
  return (
    <div
      className="relative overflow-hidden rounded-sm bg-paper"
      style={{ aspectRatio: ratio }}
    >
      {FLAVORS.map((flavor) => {
        const { src, alt } = pick(flavor.id);
        const isActive = flavor.id === active;
        return (
          <Image
            key={flavor.id}
            src={src}
            alt={isActive ? alt : ""}
            aria-hidden={!isActive}
            fill
            placeholder="blur"
            sizes={sizes}
            className={`object-cover transition-opacity duration-500 ease-dawn ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          />
        );
      })}
    </div>
  );
}

export function Flavors() {
  const { flavor } = useStore();
  const current = getFlavor(flavor);

  return (
    <section id="sabores" className="scroll-mt-20 border-b border-rule py-16 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            <CrossFade
              active={flavor}
              ratio="728 / 1024"
              sizes="(min-width: 1024px) 420px, 92vw"
              pick={(id) => ({ src: IMAGES[id].lifestyle, alt: IMAGES[id].alt })}
            />
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel index="02">Sabores</SectionLabel>
              <Heading>Dos sabores. La misma fórmula.</Heading>
              <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-slate">
                No hay versiones para hombre y para mujer, ni niveles, ni ediciones. Una sola
                fórmula y el sabor que prefieras.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <FlavorToggle idSuffix="-sabores" />
                <p key={current.id} className="animate-dawn-rise text-[15px] text-ink">
                  {current.note}
                </p>
              </div>
            </Reveal>

            <Reveal delay={120} className="mt-8">
              <CrossFade
                active={flavor}
                ratio="1600 / 1137"
                sizes="(min-width: 1024px) 620px, 92vw"
                pick={(id) => ({ src: IMAGES[id].ingredients, alt: IMAGES[id].altIngredients })}
              />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
