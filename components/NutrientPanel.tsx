"use client";

import { useEffect, useRef, useState } from "react";
import { NUTRIENT_COUNT, NUTRIENT_GROUPS, type NutrientRow } from "@/lib/nutrients";
import { MACROS } from "@/lib/product";
import { track } from "@/lib/track";
import { CountUp } from "./CountUp";
import { DailyGauge } from "./DailyGauge";
import { NutrientRows, NUTRIENT_GRID } from "./NutrientRows";
import { Reveal } from "./Reveal";
import { Container, Heading, SectionLabel } from "./Section";
import { useStore } from "./Store";

const MOBILE_PREVIEW_ROWS = 6;
const PREVIEW: readonly NutrientRow[] = NUTRIENT_GROUPS[0].rows.slice(0, MOBILE_PREVIEW_ROWS);

function GroupHeader({ title, first = false }: { title: string; first?: boolean }) {
  return (
    <div className={`${NUTRIENT_GRID} border-b border-ink pb-2.5 ${first ? "pt-0" : "pt-12"}`}>
      <span className="label-mono text-ink">{title}</span>
      <span className="label-mono col-span-2 text-right">Cantidad</span>
      <span className="label-mono text-right">% VNR</span>
    </div>
  );
}

export function NutrientPanel() {
  const { flavor } = useStore();
  const [expanded, setExpanded] = useState(false);
  const desktopSeen = useRef(false);
  const tableRef = useRef<HTMLDivElement>(null);

  // En desktop el panel ya viene abierto, así que la "apertura" se mide por
  // visibilidad. En móvil la mide el botón. La propiedad `viewport` los separa.
  useEffect(() => {
    const node = tableRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (!window.matchMedia("(min-width: 640px)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !desktopSeen.current) {
            desktopSeen.current = true;
            track("nutrient_panel_open", { sku: flavor, viewport: "desktop" });
            observer.disconnect();
          }
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [flavor]);

  const openMobile = () => {
    setExpanded(true);
    track("nutrient_panel_open", { sku: flavor, viewport: "mobile" });
  };

  return (
    <section
      id="panel-nutricional"
      className="scroll-mt-20 bg-paper-deep py-20 sm:py-28"
    >
      <Container>
        <Reveal>
          <SectionLabel index="03">Panel nutricional</SectionLabel>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-6">
            <Heading>
              La fórmula completa.
              <br />
              Sin blends propietarios.
            </Heading>
          </Reveal>
          <Reveal delay={120} className="md:col-span-5 md:col-start-8 md:self-end">
            <p className="text-[17px] leading-relaxed text-slate">
              Cada nutriente, con su cantidad exacta y su porcentaje del Valor Nutrimental de
              Referencia mexicano. Tres porciones cubren el 90% de tu día.
            </p>
          </Reveal>
        </div>

        {/* Lo que trae, y a qué equivale en tu día. */}
        <div className="mt-14 grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            <DailyGauge />
          </Reveal>

          <Reveal delay={120} className="lg:col-span-7">
            <p className="label-mono mb-5">Por porción</p>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-3">
              {MACROS.map((macro) => (
                <div key={macro.label} className="bg-card px-4 py-6">
                  <dt className="label-mono">{macro.label}</dt>
                  <dd className="num mt-2 text-[1.375rem] leading-none text-ink">
                    <CountUp to={macro.amount} decimals={macro.decimals} />
                    {macro.unit ? (
                      <span className="ml-1 text-[0.875rem] text-slate">{macro.unit}</span>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div ref={tableRef} className="mt-14">
          {!expanded ? (
            <div className="sm:hidden">
              <GroupHeader title={NUTRIENT_GROUPS[0].title} first />
              <NutrientRows rows={PREVIEW} />
              <button
                type="button"
                onClick={openMobile}
                aria-expanded={false}
                className="num mt-6 w-full rounded-pill border border-ink px-5 py-3.5 text-[12px] tracking-[0.14em] uppercase transition-colors duration-200 hover:bg-ink hover:text-paper"
              >
                Ver los {NUTRIENT_COUNT}
              </button>
            </div>
          ) : null}

          <div className={expanded ? "" : "hidden sm:block"}>
            {NUTRIENT_GROUPS.map((group, i) => (
              <Reveal key={group.title} delay={i * 100}>
                <GroupHeader title={group.title} first={i === 0} />
                <NutrientRows rows={group.rows} />
              </Reveal>
            ))}
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-slate">
          Valores por porción, idénticos en chocolate y vainilla. Sujetos a ajuste final de
          formulación. Suplemento alimenticio. Este producto no es un medicamento.
        </p>
      </Container>
    </section>
  );
}
