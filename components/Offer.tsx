import Image from "next/image";
import heroPackage from "@/media/hero-package.webp";
import { MACROS, macroText } from "@/lib/product";
import {
  HERO_TIER,
  formatPerServing,
  formatPrice,
  getTier,
  type PriceVariant,
} from "@/lib/pricing";
import { BuyButton } from "./BuyButton";
import { Reveal } from "./Reveal";
import { Container, Heading, SectionLabel } from "./Section";

const INCLUDED = [
  "20 porciones · una bolsa de 2.3 kg",
  "El sabor que elijas: chocolate o vainilla",
  "Envío gratis a todo México",
] as const;

/**
 * Una sola oferta. La sección entera es la superficie elevada, así la imagen
 * no necesita marco: se apoya directo sobre el papel claro.
 */
export function Offer({ variant }: { variant: PriceVariant }) {
  const tier = getTier(HERO_TIER);

  return (
    <section id="comprar" className="scroll-mt-20 bg-card py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionLabel index="05">Comprar</SectionLabel>
          <Heading className="max-w-xl">Una bolsa. Un precio. Nada más.</Heading>
        </Reveal>

        <div className="mt-12 grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <Reveal>
            <div className="relative mx-auto w-full max-w-[460px]">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src={heroPackage}
                  alt="Bolsa de Alba Nutrition con un medidor de polvo"
                  placeholder="blur"
                  sizes="(min-width: 768px) 460px, 92vw"
                  className="drift w-full"
                />
              </div>
              <div
                className="pointer-events-none absolute inset-x-8 -bottom-3 h-6 rounded-full bg-ink/10 blur-xl"
                aria-hidden="true"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h3 className="font-display text-2xl">{tier.name}</h3>
            <p className="mt-1.5 text-[15px] text-slate">{tier.contents}</p>

            <div className="mt-7 flex items-end gap-4">
              <span className="num text-[2.75rem] leading-none text-ink">
                {formatPrice(HERO_TIER, variant)}
              </span>
              <span className="num pb-1 text-[13px] text-ember-deep">
                {formatPerServing(HERO_TIER, variant)}
              </span>
            </div>

            <ul className="mt-8 space-y-3">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-ink">
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    className="mt-1 h-3.5 w-3.5 shrink-0 text-ember"
                  >
                    <path d="M2 8.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="1.75" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <dl className="mt-8 grid grid-cols-3 gap-x-4 border-t border-rule pt-5">
              {MACROS.slice(0, 3).map((macro) => (
                <div key={macro.label}>
                  <dt className="label-mono">{macro.label}</dt>
                  <dd className="num mt-1 text-[15px] text-ink">{macroText(macro)}</dd>
                </div>
              ))}
            </dl>

            <BuyButton
              tier={HERO_TIER}
              position="pricing_table"
              className="mt-9 w-full sm:w-auto sm:min-w-[16rem]"
            />
            <p className="mt-4 text-[12px] leading-relaxed text-slate">
              Estamos en preventa: dejas tu correo y te avisamos antes de cobrarte nada.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
