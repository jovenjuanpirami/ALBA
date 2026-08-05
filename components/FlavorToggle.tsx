"use client";

import { FLAVORS } from "@/lib/product";
import { useStore } from "./Store";

export function FlavorToggle({ idSuffix = "" }: { idSuffix?: string }) {
  const { flavor, selectFlavor } = useStore();

  return (
    <div
      role="group"
      aria-label="Elegir sabor"
      className="inline-flex rounded-pill border border-rule bg-card p-1"
    >
      {FLAVORS.map((option) => {
        const active = option.id === flavor;
        return (
          <button
            key={option.id}
            id={`flavor-${option.id}${idSuffix}`}
            type="button"
            aria-pressed={active}
            onClick={() => selectFlavor(option.id)}
            className={`num rounded-pill px-4 py-2 text-[12px] tracking-[0.14em] uppercase transition-colors duration-300 ${
              active ? "bg-ink text-paper" : "text-slate hover:text-ink"
            }`}
          >
            {option.name}
          </button>
        );
      })}
    </div>
  );
}
