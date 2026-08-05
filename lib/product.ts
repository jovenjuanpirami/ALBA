/**
 * Un solo producto. Dos sabores.
 * El campo `sku` de la base y de los eventos ahora guarda el sabor.
 */

export type Flavor = "chocolate" | "vainilla";

export type FlavorConfig = {
  id: Flavor;
  name: string;
  note: string;
};

export const FLAVORS: readonly FlavorConfig[] = [
  {
    id: "vainilla",
    name: "Vainilla",
    note: "Vainilla con canela. Dulce moderado, sin regusto.",
  },
  {
    id: "chocolate",
    name: "Chocolate",
    note: "Cacao alcalinizado para que no amargue. Dulce moderado.",
  },
] as const;

/** El sabor del render del hero, para que no haya disonancia visual al cargar. */
export const DEFAULT_FLAVOR: Flavor = "vainilla";

export function getFlavor(id: Flavor): FlavorConfig {
  const flavor = FLAVORS.find((f) => f.id === id);
  if (!flavor) throw new Error(`Sabor desconocido: ${id}`);
  return flavor;
}

export function isFlavor(value: unknown): value is Flavor {
  return value === "chocolate" || value === "vainilla";
}

export type Macro = {
  label: string;
  /** Separado del texto para poder animar el conteo. */
  amount: number;
  decimals: 0 | 1;
  unit: string;
};

/** Macros por porción. Una sola fórmula, idéntica en los dos sabores. */
export const MACROS: readonly Macro[] = [
  { label: "Energía", amount: 450, decimals: 0, unit: "kcal" },
  { label: "Proteína", amount: 35, decimals: 0, unit: "g" },
  { label: "Carbohidratos", amount: 46, decimals: 0, unit: "g" },
  { label: "Grasa", amount: 13.5, decimals: 1, unit: "g" },
  { label: "Fibra", amount: 8.5, decimals: 1, unit: "g" },
  { label: "Nutrientes", amount: 26, decimals: 0, unit: "" },
];

export function macroText(macro: Macro): string {
  const value = macro.amount.toFixed(macro.decimals);
  return macro.unit ? `${value} ${macro.unit}` : value;
}

/** Porcentaje del VNR diario que cubre cada número de porciones. */
export const VNR_PER_SERVING = 30;
export const SERVING_OPTIONS = [1, 2, 3] as const;

/**
 * Los cuatro datos del hero. La cifra va separada del sufijo para poder
 * animar el conteo sin tocar la unidad. El ámbar está reservado para
 * "60 segundos".
 */
export const HERO_FACTS: readonly {
  amount: number;
  suffix?: string;
  label: string;
  accent?: boolean;
}[] = [
  { amount: 450, label: "kcal" },
  { amount: 35, suffix: "g", label: "proteína" },
  { amount: 26, label: "nutrientes" },
  { amount: 60, label: "segundos", accent: true },
];
