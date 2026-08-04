import Image from "next/image";
import heroPackage from "@/media/hero-package.webp";
import { HERO_FACTS } from "@/lib/product";
import { HERO_TIER, formatPerServing, formatPrice, getTier, type PriceVariant } from "@/lib/pricing";
import { BuyButton } from "./BuyButton";
import { Container } from "./Section";

export function Hero({ variant }: { variant: PriceVariant }) {
  const tier = getTier(HERO_TIER);

  return (
    <section id="top" className="relative overflow-hidden border-b border-rule">
      <div
        aria-hidden="true"
        className="dawn-glow pointer-events-none absolute -top-1/3 left-1/2 h-[120%] w-[140%] -translate-x-1/2 opacity-40 sm:opacity-55"
      />

      <Container className="relative pt-10 pb-0 sm:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <p className="animate-dawn-rise label-mono">
              Suplemento alimenticio · Hecho en México
            </p>

            <h1
              className="animate-dawn-rise mt-6 text-[clamp(2.25rem,6.4vw,4rem)] leading-[1.02] font-light tracking-tight"
              style={{ "--rise-delay": "80ms" } as React.CSSProperties}
            >
              Todos los nutrientes de una comida completa, en una sola cucharada.
            </h1>

            <p
              className="animate-dawn-rise mt-6 max-w-lg text-[17px] leading-relaxed text-slate"
              style={{ "--rise-delay": "160ms" } as React.CSSProperties}
            >
              Tu primera decisión del día. Sesenta segundos con agua fría. Sin coaches, sin clubes,
              sin niveles.
            </p>

            {/* El precio va junto al CTA: la oferta tiene que ser obvia sin bajar. */}
            <div
              className="animate-dawn-rise mt-9 flex flex-wrap items-center gap-x-6 gap-y-4"
              style={{ "--rise-delay": "240ms" } as React.CSSProperties}
            >
              <BuyButton tier={HERO_TIER} position="hero" />
              <div>
                <p className="num text-[15px] text-ink">
                  {formatPrice(HERO_TIER, variant)}
                  <span className="mx-2 text-rule">·</span>
                  <span className="text-slate">{tier.contents}</span>
                </p>
                <p className="num mt-1 text-[12px] text-ember-deep">
                  {formatPerServing(HERO_TIER, variant)}
                </p>
              </div>
            </div>

            <p
              className="animate-dawn-rise mt-6 text-[13px] text-slate"
              style={{ "--rise-delay": "300ms" } as React.CSSProperties}
            >
              Envío gratis en todos los pedidos.{" "}
              <a href="#panel-nutricional" className="text-ink underline underline-offset-4">
                Ver los 26 nutrientes
              </a>
            </p>
          </div>

          <div
            className="animate-dawn-rise lg:col-span-6"
            style={{ "--rise-delay": "120ms" } as React.CSSProperties}
          >
            <div className="relative mx-auto w-full max-w-[520px] lg:mr-0 lg:ml-auto">
              <Image
                src={heroPackage}
                alt="Bolsa de Alba Nutrition con un medidor de polvo sobre una barra de cocina"
                placeholder="blur"
                priority
                sizes="(min-width: 1024px) 520px, (min-width: 640px) 480px, 92vw"
                className="w-full rounded-sm"
              />
              <div
                className="pointer-events-none absolute inset-x-6 -bottom-3 h-6 rounded-full bg-ink/10 blur-xl"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </Container>

      <div className="relative mt-10 border-t border-rule sm:mt-14">
        <Container>
          <dl className="grid grid-cols-2 divide-rule sm:grid-cols-4 sm:divide-x">
            {HERO_FACTS.map((fact, i) => (
              <div
                key={fact.label}
                className={`py-4 text-center sm:py-5 ${
                  i < 2 ? "border-b border-rule sm:border-b-0" : ""
                } ${i % 2 === 0 ? "border-r border-rule sm:border-r-0" : ""}`}
              >
                <dt className="sr-only">{fact.label}</dt>
                <dd className="num text-[12px] tracking-[0.16em] uppercase sm:text-[13px]">
                  <span className={fact.accent ? "text-ember-deep" : "text-ink"}>{fact.value}</span>{" "}
                  <span className="text-slate">{fact.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </div>
    </section>
  );
}
