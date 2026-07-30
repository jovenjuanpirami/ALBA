/**
 * Los 26 micronutrientes, al 30% del VNR mexicano por porción.
 * Idénticos en Balance y Fuerza — lo que cambia entre SKUs son los macros.
 */

export type NutrientRow = {
  name: string;
  amount: string;
  unit: "mcg" | "mg";
  vnr: string;
};

export type NutrientGroup = {
  title: string;
  rows: readonly NutrientRow[];
};

export const NUTRIENT_GROUPS: readonly NutrientGroup[] = [
  {
    title: "Vitaminas",
    rows: [
      { name: "Vitamina A", amount: "225", unit: "mcg", vnr: "30%" },
      { name: "Vitamina C", amount: "27", unit: "mg", vnr: "30%" },
      { name: "Vitamina D3", amount: "6", unit: "mcg", vnr: "30%" },
      { name: "Vitamina E", amount: "4", unit: "mg", vnr: "30%" },
      { name: "Vitamina K (K1 + K2 MK-7)", amount: "22", unit: "mcg", vnr: "30%" },
      { name: "Tiamina (B1)", amount: "0.36", unit: "mg", vnr: "30%" },
      { name: "Riboflavina (B2)", amount: "0.39", unit: "mg", vnr: "30%" },
      { name: "Niacina (B3)", amount: "4.8", unit: "mg", vnr: "30%" },
      { name: "Ácido pantoténico (B5)", amount: "1.5", unit: "mg", vnr: "30%" },
      { name: "Vitamina B6", amount: "0.39", unit: "mg", vnr: "30%" },
      { name: "Biotina (B7)", amount: "9", unit: "mcg", vnr: "30%" },
      { name: "Folato (5-MTHF)", amount: "120", unit: "mcg", vnr: "30%" },
      { name: "Vitamina B12", amount: "0.72", unit: "mcg", vnr: "30%" },
      { name: "Colina", amount: "165", unit: "mg", vnr: "30%" },
    ],
  },
  {
    title: "Minerales",
    rows: [
      { name: "Calcio", amount: "300", unit: "mg", vnr: "30%" },
      { name: "Hierro", amount: "5.4", unit: "mg", vnr: "30%" },
      { name: "Magnesio", amount: "105", unit: "mg", vnr: "30%" },
      { name: "Fósforo", amount: "210", unit: "mg", vnr: "30%" },
      { name: "Potasio", amount: "1050", unit: "mg", vnr: "30%" },
      { name: "Zinc", amount: "3.3", unit: "mg", vnr: "30%" },
      { name: "Cobre", amount: "0.27", unit: "mg", vnr: "30%" },
      { name: "Manganeso", amount: "0.69", unit: "mg", vnr: "30%" },
      { name: "Selenio", amount: "21", unit: "mcg", vnr: "30%" },
      { name: "Yodo", amount: "45", unit: "mcg", vnr: "30%" },
      { name: "Cromo", amount: "10", unit: "mcg", vnr: "30%" },
      { name: "Molibdeno", amount: "13", unit: "mcg", vnr: "30%" },
    ],
  },
] as const;

export const NUTRIENT_COUNT = NUTRIENT_GROUPS.reduce((n, g) => n + g.rows.length, 0);
