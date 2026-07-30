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

/** Macros por porción. Una sola fórmula, idéntica en los dos sabores. */
export const MACROS = [
  { label: "Energía", value: "450 kcal" },
  { label: "Proteína", value: "35 g" },
  { label: "Carbohidratos", value: "46 g" },
  { label: "Grasa", value: "13.5 g" },
  { label: "Fibra", value: "8.5 g" },
  { label: "Nutrientes", value: "26" },
] as const;

/** Los tres datos del hero. El ámbar está reservado para "60 segundos". */
export const HERO_FACTS: readonly { value: string; label: string; accent?: boolean }[] = [
  { value: "450", label: "kcal" },
  { value: "35 g", label: "proteína" },
  { value: "26", label: "nutrientes" },
  { value: "60", label: "segundos", accent: true },
];
