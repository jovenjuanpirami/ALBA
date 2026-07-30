/**
 * ÚNICA fuente de verdad de precios. Ningún precio se escribe en JSX.
 *
 * Un solo producto: la bolsa de 20 porciones.
 * El test A/B sigue vivo porque la elasticidad de precio es lo más valioso que
 * puede medir esta landing. Para dejar un precio único, iguala B a A abajo.
 */

export type PriceVariant = "A" | "B";
export const PRICE_VARIANTS: readonly PriceVariant[] = ["A", "B"] as const;

export type Tier = "bolsa";

export type TierConfig = {
  id: Tier;
  name: string;
  contents: string;
  servings: number;
  /** Precio en MXN por variante. */
  price: Record<PriceVariant, number>;
  recurring: boolean;
};

export const TIERS: readonly TierConfig[] = [
  {
    id: "bolsa",
    name: "Bolsa de Alba",
    contents: "2.3 kg · 20 porciones",
    servings: 20,
    price: { A: 990, B: 1190 },
    recurring: false,
  },
] as const;

/** El único tier: lo usan todos los CTAs. */
export const HERO_TIER: Tier = "bolsa";

export const THRESHOLDS = {
  /** 0 = envío gratis en todos los pedidos. Con un SKU de $990 no hay umbral que valga. */
  freeShipping: 0,
} as const;

/** Precios de referencia de la tabla de comparación (dato de mercado, no de Alba). */
export const COST_BENCHMARKS = [
  { label: "Café + pan dulce", cost: "$95", protein: "6 g", micros: "—" },
  { label: "Desayuno en restaurante", cost: "$180–320", protein: "25 g", micros: "parcial" },
] as const;

export function getTier(id: Tier): TierConfig {
  const tier = TIERS.find((t) => t.id === id);
  if (!tier) throw new Error(`Tier desconocido: ${id}`);
  return tier;
}

export function priceOf(id: Tier, variant: PriceVariant): number {
  return getTier(id).price[variant];
}

export function perServing(id: Tier, variant: PriceVariant): number {
  const tier = getTier(id);
  return Math.round(tier.price[variant] / tier.servings);
}

const MXN = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export function formatMXN(amount: number): string {
  return MXN.format(amount);
}

export function formatPrice(id: Tier, variant: PriceVariant): string {
  const tier = getTier(id);
  const base = formatMXN(tier.price[variant]);
  return tier.recurring ? `${base}/mes` : base;
}

export function formatPerServing(id: Tier, variant: PriceVariant): string {
  return `${formatMXN(perServing(id, variant))} por porción`;
}

export function isPriceVariant(value: unknown): value is PriceVariant {
  return value === "A" || value === "B";
}

export function isTier(value: unknown): value is Tier {
  return typeof value === "string" && TIERS.some((t) => t.id === value);
}
