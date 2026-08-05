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
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionLabel index="01">El problema</SectionLabel>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <Reveal className="md:col-span-6">
            <Heading>No desayunas mal por falta de información.</Heading>
          </Reveal>
          <Reveal delay={120} className="md:col-span-6 md:col-start-8 md:self-end">
            <div className="space-y-5 text-[17px] leading-relaxed text-slate">
              <p>
                Desayunas mal porque en la mañana no hay tiempo. Un café y lo que haya. O nada, y a
                media mañana ya andas buscando algo en la máquina.
              </p>
              <p className="text-ink">
                Alba resuelve ese hueco exacto: una comida completa de verdad, en el tiempo que te
                toma llenar un shaker.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <div className="mt-16 overflow-hidden rounded-lg bg-card shadow-soft">
            <div className="overflow-x-auto">
              <table className="num w-full min-w-136 border-collapse text-left text-[13px] sm:text-sm">
                <thead>
                  <tr>
                    <th scope="col" className="label-mono py-5 pr-4 pl-6 font-normal sm:pl-8" />
                    {COLUMNS.map((column) => (
                      <th
                        key={column}
                        scope="col"
                        className="label-mono py-5 pr-4 text-left font-normal last:pr-6 sm:last:pr-8"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COST_BENCHMARKS.map((row) => (
                    <tr key={row.label} className="border-t border-rule text-slate">
                      <th
                        scope="row"
                        className="py-5 pr-4 pl-6 font-normal text-ink sm:pl-8"
                      >
                        {row.label}
                      </th>
                      <td className="py-5 pr-4">{row.cost}</td>
                      <td className="py-5 pr-4">{row.protein}</td>
                      <td className="py-5 pr-6 sm:pr-8">{row.micros}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-rule bg-paper-deep/60">
                    <th scope="row" className="py-6 pr-4 pl-6 sm:pl-8">
                      <span className="wordmark text-[15px] text-ink">ALBA</span>
                    </th>
                    <td className="py-6 pr-4 text-[19px] text-ember-deep sm:text-xl">{albaCost}</td>
                    <td className="py-6 pr-4 text-ink">35 g</td>
                    <td className="py-6 pr-6 text-ink sm:pr-8">26 al 30% VNR</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
