import { HERO_TIER } from "@/lib/pricing";
import { BuyButton } from "./BuyButton";
import { SunMark, Wordmark } from "./Logo";
import { Reveal } from "./Reveal";
import { Container } from "./Section";

export function Footer() {
  const year = 2026;

  return (
    <footer className="bg-ink pb-24 text-paper sm:pb-0">
      <Container className="py-24 sm:py-32">
        <Reveal className="flex flex-col items-center text-center">
          <SunMark className="h-11" />
          <Wordmark className="mt-8 text-3xl sm:text-4xl" withNutrition />

          <h2 className="mt-14 max-w-2xl text-[clamp(2rem,5vw,3.25rem)] text-paper">
            Que mañana el desayuno ya no sea el problema.
          </h2>

          <div className="mt-10">
            <BuyButton tier={HERO_TIER} position="footer" tone="invert" />
          </div>
        </Reveal>
      </Container>

      <div className="border-t border-paper/12">
        <Container className="grid gap-8 py-14 md:grid-cols-2">
          <p className="max-w-md text-[14px] leading-relaxed text-paper/55">
            Suplemento alimenticio. Este producto no es un medicamento. El consumo de este producto
            es responsabilidad de quien lo recomienda y de quien lo usa. Formulado y hecho en México
            contra el Valor Nutrimental de Referencia mexicano.
          </p>
          <p className="max-w-md text-[14px] leading-relaxed text-paper/55 md:justify-self-end">
            Producto en preventa: los pedidos aún no están abiertos y este sitio no procesa pagos ni
            solicita datos de tarjeta.
          </p>
        </Container>
      </div>

      <div className="border-t border-paper/12">
        <Container className="flex flex-col gap-3 py-7 sm:flex-row sm:items-center sm:justify-between">
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
