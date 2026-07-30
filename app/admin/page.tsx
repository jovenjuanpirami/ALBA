import { notFound } from "next/navigation";
import { buildReport, type Breakdown, type VariantReport } from "@/lib/analytics";
import { TIERS, formatMXN, formatPrice, type PriceVariant } from "@/lib/pricing";

export const dynamic = "force-dynamic";

type Verdict = "matar" | "iterar" | "adelante";

/** Umbrales de decisión de la sección 11 del brief. */
function verdict(value: number | null, kill: number, go: number): Verdict | null {
  if (value === null) return null;
  if (value < kill) return "matar";
  if (value > go) return "adelante";
  return "iterar";
}

const VERDICT_STYLE: Record<Verdict, string> = {
  matar: "bg-[#7a1b1b] text-paper",
  iterar: "bg-amber text-ink",
  adelante: "bg-ink text-paper",
};

function pct(value: number): string {
  return `${value.toFixed(1)}%`;
}

function Metric({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: Verdict | null;
}) {
  return (
    <div className="border-b border-rule py-3.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="label-mono">{label}</span>
        <span className="flex items-baseline gap-2">
          {tone ? (
            <span
              className={`num rounded-xs px-1.5 py-0.5 text-[10px] tracking-[0.1em] uppercase ${VERDICT_STYLE[tone]}`}
            >
              {tone}
            </span>
          ) : null}
          <span className="num text-[15px] text-ink">{value}</span>
        </span>
      </div>
      {sub ? <p className="num mt-1 text-[11px] text-slate">{sub}</p> : null}
    </div>
  );
}

function BreakdownTable({ title, rows }: { title: string; rows: Breakdown }) {
  return (
    <div>
      <p className="label-mono border-b border-ink pb-2">{title}</p>
      {rows.length === 0 ? (
        <p className="num py-3 text-[12px] text-slate">Sin datos</p>
      ) : (
        rows.slice(0, 12).map((row) => (
          <div
            key={row.key}
            className="flex items-baseline justify-between gap-4 border-b border-rule py-2"
          >
            <span className="truncate text-[13px] text-ink">{row.label}</span>
            <span className="num shrink-0 text-[12px] text-slate">
              {row.count}
              <span className="ml-2 text-ink">{pct(row.share)}</span>
            </span>
          </div>
        ))
      )}
    </div>
  );
}

function VariantColumn({
  report,
  heading,
  priceNote,
}: {
  report: VariantReport;
  heading: string;
  priceNote: string;
}) {
  return (
    <div className="border border-rule bg-paper p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold">{heading}</h2>
        <span className="num text-[12px] text-slate">{priceNote}</span>
      </div>

      <div className="mt-5">
        <Metric label="Visitantes únicos" value={String(report.visitors)} />
        <Metric
          label="Clics en Comprar"
          value={String(report.clickSessions)}
          sub={`${report.clicks} clics totales · ${pct(report.rates.visitorToClick)} de los visitantes`}
          tone={verdict(report.visitors > 0 ? report.rates.visitorToClick : null, 4, 7)}
        />
        <Metric
          label="Vieron el modal"
          value={String(report.modalViewSessions)}
          sub={`${pct(report.rates.clickToModal)} de los que dieron clic`}
        />
        <Metric
          label="Clic sin dejar correo"
          value={String(report.abandonedSessions)}
          sub={
            report.dismissMedianSeconds === null
              ? `${report.modalDismissals} cierres del modal`
              : `${report.modalDismissals} cierres · ${report.dismissMedianSeconds}s con el modal abierto (mediana)`
          }
        />
        <Metric
          label="Registros / visitante"
          value={pct(report.rates.visitorToSignup)}
          sub={`${report.signups} registros — MÉTRICA PRINCIPAL`}
          tone={verdict(report.visitors > 0 ? report.rates.visitorToSignup : null, 1.5, 3)}
        />
        <Metric
          label="Registros / clic"
          value={pct(report.rates.clickToSignup)}
          sub="calidad del modal"
          tone={verdict(report.clickSessions > 0 ? report.rates.clickToSignup : null, 30, 45)}
        />
        {/* Umbrales recalibrados al precio de la bolsa (A = $990), no a la suscripción vieja. */}
        <Metric
          label="WTP mediana"
          value={report.wtpMedian === null ? "—" : formatMXN(report.wtpMedian)}
          sub={`${report.wtpAnswers.length} respuestas · por bolsa`}
          tone={verdict(report.wtpMedian, 800, 1100)}
        />
        <Metric
          label="Panel nutricional"
          value={pct(report.rates.visitorToPanel)}
          sub={`${report.panelOpenSessions} sesiones`}
        />
      </div>

      <div className="mt-6 space-y-6">
        <BreakdownTable title="Clics por sabor" rows={report.bySku} />
        <BreakdownTable title="Clics por posición" rows={report.byPosition} />
        <div>
          <p className="label-mono border-b border-ink pb-2">Profundidad de scroll</p>
          {[25, 50, 75, 100].map((depth) => (
            <div
              key={depth}
              className="flex items-baseline justify-between gap-4 border-b border-rule py-2"
            >
              <span className="num text-[13px] text-ink">{depth}%</span>
              <span className="num text-[12px] text-slate">
                {report.scrollDepth[depth] ?? 0}
                <span className="ml-2 text-ink">
                  {pct(
                    report.visitors > 0
                      ? ((report.scrollDepth[depth] ?? 0) / report.visitors) * 100
                      : 0,
                  )}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function priceNote(variant: PriceVariant): string {
  return formatPrice("bolsa", variant);
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const expected = process.env.ADMIN_DASHBOARD_TOKEN;
  const { token } = await searchParams;

  // Sin token configurado o token incorrecto: 404, no revelamos que la ruta existe.
  if (!expected || !token || token !== expected) notFound();

  let report: Awaited<ReturnType<typeof buildReport>>;
  try {
    report = await buildReport();
  } catch (error) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-2xl font-semibold">No se pudo leer la base</h1>
        <p className="num mt-4 text-[13px] text-slate">
          {error instanceof Error ? error.message : "Error desconocido"}
        </p>
      </main>
    );
  }

  const exportHref = (table: "waitlist" | "events") =>
    `/api/admin/export?table=${table}&token=${encodeURIComponent(token)}`;

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8">
      <div className="flex flex-col gap-4 border-b border-ink pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label-mono">Alba · test de validación</p>
          <h1 className="mt-2 text-3xl font-semibold">Dashboard interno</h1>
          <p className="num mt-2 text-[12px] text-slate">
            {report.eventCount} eventos · {report.waitlistCount} registros ·{" "}
            {new Date(report.generatedAt).toLocaleString("es-MX")}
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href={exportHref("waitlist")}
            className="num rounded-xs border border-ink px-4 py-2.5 text-[12px] tracking-[0.1em] uppercase hover:bg-ink hover:text-paper"
          >
            CSV waitlist
          </a>
          <a
            href={exportHref("events")}
            className="num rounded-xs border border-ink px-4 py-2.5 text-[12px] tracking-[0.1em] uppercase hover:bg-ink hover:text-paper"
          >
            CSV eventos
          </a>
        </div>
      </div>

      {!report.configured ? (
        <p className="num mt-6 border border-rule bg-paper-deep p-4 text-[13px] text-ink">
          Supabase no está configurado. Falta NEXT_PUBLIC_SUPABASE_URL o
          SUPABASE_SERVICE_ROLE_KEY, así que todos los números salen en cero.
        </p>
      ) : null}

      <p className="num mt-6 text-[12px] leading-relaxed text-slate">
        Tráfico mínimo para que el dato signifique algo: 2,000 visitantes únicos por variante.
        Actualmente A={report.variants[0].visitors} · B={report.variants[1].visitors}. El costo por
        registro sale del gasto en Meta, no de esta tabla.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <VariantColumn report={report.totals} heading="Total" priceNote="A + B" />
        {report.variants.map((variantReport) => (
          <VariantColumn
            key={variantReport.variant}
            report={variantReport}
            heading={`Variante ${variantReport.variant}`}
            priceNote={priceNote(variantReport.variant)}
          />
        ))}
      </div>

      <section className="mt-12 border-t border-ink pt-8">
        <h2 className="font-display text-xl font-normal tracking-tight">Quién está entrando</h2>
        <p className="num mt-2 text-[12px] text-slate">
          Sesiones únicas con page_view. Esto es tráfico, no registros.
        </p>
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <BreakdownTable title="Visitantes por utm_source" rows={report.visitorsBySource} />
          <BreakdownTable title="Visitantes por utm_campaign" rows={report.visitorsByCampaign} />
          <BreakdownTable title="Visitantes por device" rows={report.visitorsByDevice} />
          <BreakdownTable
            title="Clic de anuncio (fbclid / gclid)"
            rows={report.visitorsByAdClick}
          />
          <BreakdownTable title="Nuevos vs recurrentes" rows={report.visitorsNewVsReturning} />
        </div>
      </section>

      <section className="mt-12 border-t border-ink pt-8">
        <h2 className="font-display text-xl font-normal tracking-tight">Quién dejó su correo</h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-3">
          <BreakdownTable title="Registros por utm_campaign" rows={report.byCampaign} />
          <BreakdownTable title="Registros por utm_content" rows={report.byContent} />
          <BreakdownTable title="Registros por device" rows={report.byDevice} />
        </div>
      </section>

      <div className="mt-10 border-t border-rule pt-6">
        <p className="label-mono">Precios por variante</p>
        <div className="num mt-3 grid gap-2 text-[13px] sm:grid-cols-2">
          {TIERS.map((tier) => (
            <div key={tier.id} className="flex justify-between border-b border-rule py-1.5">
              <span className="text-ink">{tier.name}</span>
              <span className="text-slate">
                A {formatMXN(tier.price.A)} · B {formatMXN(tier.price.B)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
