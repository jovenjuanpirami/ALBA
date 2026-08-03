import { NUTRIENT_GROUPS } from "@/lib/nutrients";

const NAMES = NUTRIENT_GROUPS.flatMap((group) => group.rows.map((row) => row.name));

/**
 * Los 26 nombres desfilando en mono. Es dato real usado como textura: anuncia
 * la sección firme antes de que empiece la tabla.
 * La lista va duplicada porque la animación traslada exactamente el 50%.
 */
export function NutrientTicker() {
  return (
    <div className="group relative overflow-hidden border-y border-ink/15 bg-ink py-3.5">
      <div className="ticker flex w-max">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {NAMES.map((name) => (
              <li
                key={name}
                className="label-tracked flex items-center gap-6 px-6 whitespace-nowrap text-paper/55"
              >
                {name}
                <span className="h-1 w-1 rounded-full bg-amber" aria-hidden="true" />
              </li>
            ))}
          </ul>
        ))}
      </div>

      {/* Desvanecido en los bordes para que no se corte en seco. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-ink to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-ink to-transparent"
      />
    </div>
  );
}
