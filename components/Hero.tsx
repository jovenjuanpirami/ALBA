import heroPackage from "@/media/hero-package.webp";
import { HERO_FACTS } from "@/lib/product";
import { HERO_TIER, formatPerServing, formatPrice, getTier, type PriceVariant } from "@/lib/pricing";
import { BuyButton } from "./BuyButton";
import { HeroMedia } from "./HeroMedia";
import { Container } from "./Section";

export function Hero({ variant }: { variant: PriceVariant }) {
  const tier = getTier(HERO_TIER);

  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="dawn-glow pointer-events-none absolute -top-1/4 left-1/2 h-[90%] w-[130%] -translate-x-1/2 opacity-50"
      />

      <Container className="relative pt-14 pb-16 sm:pt-20 sm:pb-20">
        <div className="flex flex-col items-center text-center">
          <p className="animate-dawn-rise label-mono">
            Suplemento alimenticio · Hecho en México
          </p>

          <h1
            className="animate-dawn-rise mt-8 max-w-4xl text-[clamp(2.5rem,6.6vw,4.75rem)]"
            style={{ "--rise-delay": "80ms" } as React.CSSProperties}
          >
            Todos los nutrientes de una comida completa, en una sola cucharada.
          </h1>

          <p
            className="animate-dawn-rise mt-8 max-w-xl text-[17px] leading-relaxed text-slate sm:text-lg"
            style={{ "--rise-delay": "160ms" } as React.CSSProperties}
          >
            Tu primera decisión del día, resuelta. Sesenta segundos con agua fría y sales por la
            puerta.
          </p>

          <div
            className="animate-dawn-rise mt-10 flex flex-col items-center gap-5"
            style={{ "--rise-delay": "240ms" } as React.CSSProperties}
          >
            <BuyButton tier={HERO_TIER} position="hero" />
            <p className="num text-[13px] text-slate">
              {formatPrice(HERO_TIER, variant)}
              <span className="mx-2 text-rule">·</span>
              {tier.contents}
              <span className="mx-2 text-rule">·</span>
              <span className="text-ember-deep">{formatPerServing(HERO_TIER, variant)}</span>
            </p>
          </div>
        </div>

        <div
          className="animate-dawn-rise mt-14 sm:mt-16"
          style={{ "--rise-delay": "320ms" } as React.CSSProperties}
        >
          <HeroMedia
            poster={heroPackage}
            alt="Bolsa de Alba Nutrition con un medidor de polvo sobre una barra de cocina"
          />
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-y-8 sm:mt-14 sm:grid-cols-4">
          {HERO_FACTS.map((fact) => (
            <div key={fact.label} className="text-center">
              <dt className="sr-only">{fact.label}</dt>
              <dd>
                <span
                  className={`num block text-[1.75rem] leading-none ${
                    fact.accent ? "text-ember-deep" : "text-ink"
                  }`}
                >
                  {fact.value}
                </span>
                <span className="label-mono mt-2.5 block">{fact.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
