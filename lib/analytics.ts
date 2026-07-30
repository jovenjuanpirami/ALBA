import { PRICE_VARIANTS, TIERS, type PriceVariant } from "./pricing";
import { FLAVORS } from "./product";
import { getServiceClient } from "./supabase";

export type EventRow = {
  session_id: string;
  event_name: string;
  properties: Record<string, unknown> | null;
  price_variant: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  device: string | null;
  created_at: string;
};

export type WaitlistRow = {
  email: string;
  created_at: string;
  session_id: string;
  sku_clicked: string | null;
  tier_clicked: string | null;
  price_variant: string;
  price_shown: number | null;
  wtp_response: number | null;
  city_guess: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  referrer: string | null;
  device: string | null;
};

const PAGE_SIZE = 1000;
const MAX_PAGES = 100; // tope de seguridad: 100k filas

async function fetchAll<T>(table: "events" | "waitlist", columns: string): Promise<T[]> {
  const supabase = getServiceClient();
  if (!supabase) return [];

  const rows: T[] = [];
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const from = page * PAGE_SIZE;
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .order("created_at", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw new Error(`${table}: ${error.message}`);
    if (!data || data.length === 0) break;
    rows.push(...(data as unknown as T[]));
    if (data.length < PAGE_SIZE) break;
  }
  return rows;
}

export type Breakdown = { key: string; label: string; count: number; share: number }[];

export type VariantReport = {
  variant: PriceVariant;
  visitors: number;
  clickSessions: number;
  clicks: number;
  modalViewSessions: number;
  modalDismissals: number;
  /** Sesiones que dieron clic en comprar y NO dejaron correo. */
  abandonedSessions: number;
  /** Segundos que tuvieron el modal abierto antes de cerrarlo, mediana. */
  dismissMedianSeconds: number | null;
  signups: number;
  wtpAnswers: number[];
  wtpMedian: number | null;
  panelOpenSessions: number;
  scrollDepth: Record<number, number>;
  byTier: Breakdown;
  bySku: Breakdown;
  byPosition: Breakdown;
  rates: {
    visitorToSignup: number;
    visitorToClick: number;
    clickToSignup: number;
    clickToModal: number;
    visitorToPanel: number;
  };
};

export type Report = {
  configured: boolean;
  generatedAt: string;
  totals: VariantReport;
  variants: VariantReport[];
  /** Registros (waitlist). */
  byCampaign: Breakdown;
  byContent: Breakdown;
  byDevice: Breakdown;
  /** Visitantes (sesiones únicas con page_view) — "quién está entrando". */
  visitorsBySource: Breakdown;
  visitorsByCampaign: Breakdown;
  visitorsByDevice: Breakdown;
  visitorsByAdClick: Breakdown;
  visitorsNewVsReturning: Breakdown;
  waitlistCount: number;
  eventCount: number;
};

const SCROLL_DEPTHS = [25, 50, 75, 100];

function rate(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return (numerator / denominator) * 100;
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? Math.round((sorted[mid - 1] + sorted[mid]) / 2) : sorted[mid];
}

function distinctSessions(events: EventRow[], name: string): number {
  const set = new Set<string>();
  for (const event of events) if (event.event_name === name) set.add(event.session_id);
  return set.size;
}

function countBy(
  events: EventRow[],
  eventName: string,
  property: string,
  known: readonly { id: string; name: string }[],
): Breakdown {
  const counts = new Map<string, number>();
  let total = 0;
  for (const event of events) {
    if (event.event_name !== eventName) continue;
    const raw = event.properties?.[property];
    const key = typeof raw === "string" ? raw : "—";
    counts.set(key, (counts.get(key) ?? 0) + 1);
    total += 1;
  }

  const labelOf = (key: string) => known.find((k) => k.id === key)?.name ?? key;
  const keys = new Set<string>([...known.map((k) => k.id), ...counts.keys()]);

  return [...keys]
    .map((key) => ({
      key,
      label: labelOf(key),
      count: counts.get(key) ?? 0,
      share: rate(counts.get(key) ?? 0, total),
    }))
    .filter((row) => row.count > 0 || known.some((k) => k.id === row.key))
    .sort((a, b) => b.count - a.count);
}

/**
 * Sesiones únicas agrupadas por una columna de `events`. Ésta es la vista de
 * "quién está entrando": cuenta visitantes, no eventos.
 */
function sessionsByColumn(events: EventRow[], field: "utm_source" | "utm_campaign" | "device"): Breakdown {
  const buckets = new Map<string, Set<string>>();
  for (const event of events) {
    if (event.event_name !== "page_view") continue;
    const raw = event[field];
    const key = typeof raw === "string" && raw.length > 0 ? raw : "directo / sin utm";
    let set = buckets.get(key);
    if (!set) {
      set = new Set<string>();
      buckets.set(key, set);
    }
    set.add(event.session_id);
  }

  const total = [...buckets.values()].reduce((n, set) => n + set.size, 0);
  return [...buckets.entries()]
    .map(([key, set]) => ({ key, label: key, count: set.size, share: rate(set.size, total) }))
    .sort((a, b) => b.count - a.count);
}

/** Sesiones únicas agrupadas por una propiedad de page_view (click_source, is_returning). */
function sessionsByProperty(
  events: EventRow[],
  property: string,
  labels: Record<string, string> = {},
): Breakdown {
  const buckets = new Map<string, Set<string>>();
  for (const event of events) {
    if (event.event_name !== "page_view") continue;
    const raw = event.properties?.[property];
    const key = raw === undefined || raw === null ? "(sin dato)" : String(raw);
    let set = buckets.get(key);
    if (!set) {
      set = new Set<string>();
      buckets.set(key, set);
    }
    set.add(event.session_id);
  }

  const total = [...buckets.values()].reduce((n, set) => n + set.size, 0);
  return [...buckets.entries()]
    .map(([key, set]) => ({
      key,
      label: labels[key] ?? key,
      count: set.size,
      share: rate(set.size, total),
    }))
    .sort((a, b) => b.count - a.count);
}

function groupWaitlist(rows: WaitlistRow[], field: keyof WaitlistRow): Breakdown {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const raw = row[field];
    const key = typeof raw === "string" && raw.length > 0 ? raw : "(sin dato)";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const total = rows.length;
  return [...counts.entries()]
    .map(([key, count]) => ({ key, label: key, count, share: rate(count, total) }))
    .sort((a, b) => b.count - a.count);
}

function buildVariantReport(
  variant: PriceVariant | "todas",
  events: EventRow[],
  waitlist: WaitlistRow[],
): VariantReport {
  const visitors = distinctSessions(events, "page_view");
  const clickSessions = distinctSessions(events, "purchase_intent_click");
  const clicks = events.filter((e) => e.event_name === "purchase_intent_click").length;
  const modalViewSessions = distinctSessions(events, "waitlist_modal_view");
  const modalDismissals = events.filter((e) => e.event_name === "waitlist_modal_dismiss").length;
  const panelOpenSessions = distinctSessions(events, "nutrient_panel_open");
  const signups = waitlist.length;

  const wtpAnswers = waitlist
    .map((row) => row.wtp_response)
    .filter((value): value is number => typeof value === "number" && value > 0);

  const dismissSeconds = events
    .filter((e) => e.event_name === "waitlist_modal_dismiss")
    .map((e) => Number(e.properties?.seconds_open))
    .filter((value) => Number.isFinite(value) && value >= 0);

  const scrollDepth: Record<number, number> = {};
  for (const depth of SCROLL_DEPTHS) {
    const set = new Set<string>();
    for (const event of events) {
      if (event.event_name !== "scroll_depth") continue;
      if (Number(event.properties?.depth) === depth) set.add(event.session_id);
    }
    scrollDepth[depth] = set.size;
  }

  return {
    variant: variant === "todas" ? "A" : variant,
    visitors,
    clickSessions,
    clicks,
    modalViewSessions,
    modalDismissals,
    // Los que llegaron al momento de pagar y no dejaron correo. La resta puede
    // quedar en cero si alguien se registró en una sesión distinta a la del clic.
    abandonedSessions: Math.max(0, clickSessions - signups),
    dismissMedianSeconds: median(dismissSeconds),
    signups,
    wtpAnswers,
    wtpMedian: median(wtpAnswers),
    panelOpenSessions,
    scrollDepth,
    byTier: countBy(
      events,
      "purchase_intent_click",
      "tier",
      TIERS.map((t) => ({ id: t.id, name: t.name })),
    ),
    bySku: countBy(
      events,
      "purchase_intent_click",
      "sku",
      FLAVORS.map((f) => ({ id: f.id, name: f.name })),
    ),
    byPosition: countBy(events, "purchase_intent_click", "position", [
      { id: "hero", name: "Hero" },
      { id: "pricing_table", name: "Tabla de precios" },
      { id: "sticky_bar", name: "Barra pegajosa" },
      { id: "footer", name: "Footer" },
    ]),
    rates: {
      visitorToSignup: rate(signups, visitors),
      visitorToClick: rate(clickSessions, visitors),
      clickToSignup: rate(signups, clickSessions),
      clickToModal: rate(modalViewSessions, clickSessions),
      visitorToPanel: rate(panelOpenSessions, visitors),
    },
  };
}

export async function buildReport(): Promise<Report> {
  const supabase = getServiceClient();
  if (!supabase) {
    const empty = buildVariantReport("todas", [], []);
    return {
      configured: false,
      generatedAt: new Date().toISOString(),
      totals: empty,
      variants: PRICE_VARIANTS.map((v) => ({ ...buildVariantReport(v, [], []), variant: v })),
      byCampaign: [],
      byContent: [],
      byDevice: [],
      visitorsBySource: [],
      visitorsByCampaign: [],
      visitorsByDevice: [],
      visitorsByAdClick: [],
      visitorsNewVsReturning: [],
      waitlistCount: 0,
      eventCount: 0,
    };
  }

  const [events, waitlist] = await Promise.all([
    fetchAll<EventRow>(
      "events",
      "session_id,event_name,properties,price_variant,utm_source,utm_campaign,device,created_at",
    ),
    fetchAll<WaitlistRow>(
      "waitlist",
      "email,created_at,session_id,sku_clicked,tier_clicked,price_variant,price_shown,wtp_response,city_guess,utm_source,utm_medium,utm_campaign,utm_content,referrer,device",
    ),
  ]);

  return {
    configured: true,
    generatedAt: new Date().toISOString(),
    totals: buildVariantReport("todas", events, waitlist),
    variants: PRICE_VARIANTS.map((variant) => ({
      ...buildVariantReport(
        variant,
        events.filter((e) => e.price_variant === variant),
        waitlist.filter((w) => w.price_variant === variant),
      ),
      variant,
    })),
    byCampaign: groupWaitlist(waitlist, "utm_campaign"),
    byContent: groupWaitlist(waitlist, "utm_content"),
    byDevice: groupWaitlist(waitlist, "device"),
    visitorsBySource: sessionsByColumn(events, "utm_source"),
    visitorsByCampaign: sessionsByColumn(events, "utm_campaign"),
    visitorsByDevice: sessionsByColumn(events, "device"),
    visitorsByAdClick: sessionsByProperty(events, "click_source", {
      "(sin dato)": "sin clic de anuncio",
    }),
    visitorsNewVsReturning: sessionsByProperty(events, "is_returning", {
      true: "recurrente",
      false: "nuevo",
      "(sin dato)": "sin dato",
    }),
    waitlistCount: waitlist.length,
    eventCount: events.length,
  };
}

export async function fetchTableRows(table: "events" | "waitlist"): Promise<Record<string, unknown>[]> {
  const columns =
    table === "events"
      ? "created_at,session_id,event_name,properties,price_variant,utm_source,utm_campaign,device,user_agent"
      : "created_at,email,session_id,sku_clicked,tier_clicked,price_variant,price_shown,wtp_response,city_guess,utm_source,utm_medium,utm_campaign,utm_content,referrer,device";
  return fetchAll<Record<string, unknown>>(table, columns);
}

export function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    const text = typeof value === "object" ? JSON.stringify(value) : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const lines = [headers.join(",")];
  for (const row of rows) lines.push(headers.map((header) => escape(row[header])).join(","));
  return lines.join("\n");
}
