import { HERO_TIER } from "@/lib/pricing";
import { BuyButton } from "./BuyButton";
import { SunMark, Wordmark } from "./Logo";
import { Reveal } from "./Reveal";
import { Container } from "./Section";

export function Footer() {
  const year = 2026;

  return (
    <footer className="bg-ink pb-20 text-paper sm:pb-0">
      <Container className="py-20 sm:py-24">
        <Reveal className="flex flex-col items-center text-center">
          <SunMark className="h-10" />
          <Wordmark className="mt-7 text-3xl sm:text-4xl" withNutrition />

          <h2 className="mt-12 max-w-lg text-[clamp(1.5rem,4vw,2.25rem)] leading-[1.08] font-light tracking-tight text-paper">
            Empieza mañana a las 7:40.
          </h2>

          <div className="mt-8">
            <BuyButton tier={HERO_TIER} position="footer" tone="invert" />
          </div>
        </Reveal>
      </Container>

      <div className="border-t border-paper/12">
        <Container className="grid gap-8 py-12 md:grid-cols-2">
          <p className="max-w-md text-[13px] leading-relaxed text-paper/55">
            Suplemento alimenticio. Este producto no es un medicamento. El consumo de este producto
            es responsabilidad de quien lo recomienda y de quien lo usa. Formulado y hecho en México
            contra el Valor Nutrimental de Referencia mexicano.
          </p>
          <p className="max-w-md text-[13px] leading-relaxed text-paper/55 md:justify-self-end">
            Producto en preventa: los pedidos aún no están abiertos y este sitio no procesa pagos ni
            solicita datos de tarjeta.
          </p>
        </Container>
      </div>

      <div className="border-t border-paper/12">
        <Container className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-tracked text-paper/50">© {year} Alba · Hecho en México</p>
          <a
            href="/aviso-de-privacidad"
            className="label-tracked text-paper/80 underline underline-offset-4 transition-colors hover:text-amber"
          >
            Aviso de privacidad
          </a>
        </Container>
      </div>
    </footer>
  );
}
