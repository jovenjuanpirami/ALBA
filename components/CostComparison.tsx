import {
  COST_BENCHMARKS,
  HERO_TIER,
  formatMXN,
  perServing,
  type PriceVariant,
} from "@/lib/pricing";
import { Reveal } from "./Reveal";
import { Container, Heading, SectionLabel } from "./Section";

const COLUMNS = ["Costo", "Proteína", "Micronutrientes"] as const;

export function CostComparison({ variant }: { variant: PriceVariant }) {
  const albaCost = formatMXN(perServing(HERO_TIER, variant));

  return (
    <section className="border-b border-rule py-16 sm:py-24">
      <Container>
        <Reveal>
          <SectionLabel index="02">El problema</SectionLabel>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <Reveal className="md:col-span-6">
            <Heading>No desayunas mal por falta de información.</Heading>
          </Reveal>
          <Reveal delay={120} className="md:col-span-6 md:col-start-8">
            <div className="space-y-5 text-[17px] leading-relaxed text-slate">
              <p>
                Desayunas mal porque a las 7:40 de la mañana no hay tiempo. Un café y lo que haya. O
                nada, y a las once ya andas buscando algo en la máquina.
              </p>
              <p className="border-l border-ember pl-5 text-ink">
                Alba resuelve exactamente ese hueco: una comida completa de verdad, en el tiempo que
                te toma llenar un shaker.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <div className="-mx-5 mt-14 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <table className="num w-full min-w-[34rem] border-collapse text-left text-[13px] sm:text-sm">
              <thead>
                <tr className="border-b border-ink">
                  <th scope="col" className="label-mono py-3 pr-4 font-normal" />
                  {COLUMNS.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="label-mono py-3 pr-4 text-left font-normal last:pr-0"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COST_BENCHMARKS.map((row) => (
                  <tr key={row.label} className="border-b border-rule text-slate">
                    <th scope="row" className="py-4 pr-4 font-normal text-ink">
                      {row.label}
                    </th>
                    <td className="py-4 pr-4">{row.cost}</td>
                    <td className="py-4 pr-4">{row.protein}</td>
                    <td className="py-4">{row.micros}</td>
                  </tr>
                ))}
                <tr className="border-b border-ink bg-card">
                  <th scope="row" className="py-5 pr-4 pl-3">
                    <span className="wordmark text-[15px] font-normal text-ink">ALBA</span>
                  </th>
                  <td className="py-5 pr-4 text-[17px] text-ember-deep sm:text-lg">{albaCost}</td>
                  <td className="py-5 pr-4 text-ink">35 g</td>
                  <td className="py-5 text-ink">26 al 30% VNR</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
