import { HERO_FACTS } from "@/lib/product";
import { HERO_TIER, formatPerServing, formatPrice, getTier, type PriceVariant } from "@/lib/pricing";
import { BuyButton } from "./BuyButton";
import { HeroBackdrop } from "./HeroBackdrop";
import { Container } from "./Section";

export function Hero({ variant }: { variant: PriceVariant }) {
  const tier = getTier(HERO_TIER);

  return (
    <section id="top" className="relative isolate flex min-h-[92svh] flex-col justify-center">
      <HeroBackdrop />

      <Container className="relative pt-24 pb-14 sm:pt-28 sm:pb-16">
        <div className="flex flex-col items-center text-center">
          <p className="animate-dawn-rise label-mono">
            Suplemento alimenticio · Hecho en México
          </p>

          <h1
            className="animate-dawn-rise mt-9 max-w-4xl text-[clamp(2.5rem,7vw,5.25rem)]"
            style={{ "--rise-delay": "120ms" } as React.CSSProperties}
          >
            Todos los nutrientes de una comida completa, en una sola cucharada.
          </h1>

          <p
            className="animate-dawn-rise mt-9 max-w-xl text-[17px] leading-relaxed text-slate sm:text-lg"
            style={{ "--rise-delay": "260ms" } as React.CSSProperties}
          >
            Tu primera decisión del día, resuelta. Sesenta segundos con agua fría y sales por la
            puerta.
          </p>

          <div
            className="animate-dawn-rise mt-11 flex flex-col items-center gap-5"
            style={{ "--rise-delay": "400ms" } as React.CSSProperties}
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
      </Container>

      <Container className="relative pb-16 sm:pb-20">
        <dl
          className="animate-dawn-rise grid grid-cols-2 gap-y-9 sm:grid-cols-4"
          style={{ "--rise-delay": "560ms" } as React.CSSProperties}
        >
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
                <span className="label-mono mt-3 block">{fact.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
