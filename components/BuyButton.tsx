"use client";

import type { ClickPosition } from "@/lib/events";
import { formatPrice, type Tier } from "@/lib/pricing";
import { useStore } from "./Store";

type Props = {
  tier: Tier;
  position: ClickPosition;
  /** Si se omite, el label se arma desde lib/pricing con la variante activa. */
  label?: string;
  tone?: "solid" | "outline" | "quiet" | "invert";
  size?: "md" | "lg";
  className?: string;
  /** Distingue superficies que comparten `position`, ej. header vs barra inferior. */
  ui?: string;
  /** -1 cuando el botón está fuera de pantalla (barra pegajosa oculta). */
  tabIndex?: number;
};

const TONE = {
  // El hover invierte a tinta sobre ámbar: papel sobre ámbar/ember no llega a AA.
  solid: "bg-ink text-paper hover:bg-amber hover:text-ink shadow-soft hover:shadow-lift",
  outline: "bg-transparent text-ink ring-1 ring-ink/25 ring-inset hover:bg-ink hover:text-paper hover:ring-ink",
  quiet: "bg-card text-ink ring-1 ring-rule ring-inset hover:ring-ink/40 shadow-soft",
  // Para el footer oscuro. Es una variante propia y no un override por className,
  // porque el orden de clases en JSX no decide qué utilidad de Tailwind gana.
  invert: "bg-paper text-ink hover:bg-amber shadow-soft hover:shadow-lift",
} as const;

const SIZE = {
  md: "px-6 py-3 text-[14px]",
  lg: "px-8 py-4 text-[15px]",
} as const;

export function BuyButton({
  tier,
  position,
  label,
  tone = "solid",
  size = "lg",
  className = "",
  ui,
  tabIndex,
}: Props) {
  const { variant, openWaitlist } = useStore();

  return (
    <button
      type="button"
      tabIndex={tabIndex}
      onClick={() => openWaitlist({ tier, position, ui })}
      className={`group inline-flex items-center justify-center gap-2.5 rounded-pill font-medium tracking-tight transition-all duration-300 ease-dawn active:scale-[0.98] ${TONE[tone]} ${SIZE[size]} ${className}`}
    >
      <span>{label ?? `Comprar — ${formatPrice(tier, variant)}`}</span>
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="h-3 w-3 shrink-0 transition-transform duration-300 ease-dawn group-hover:translate-x-1"
      >
        <path
          d="M2 8h11M9 4l4 4-4 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
