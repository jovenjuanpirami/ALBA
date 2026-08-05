"use client";

import { useEffect, useRef } from "react";
import type { NutrientRow } from "@/lib/nutrients";

const GRID =
  "grid grid-cols-[1fr_4.25rem_2.25rem_3rem] items-baseline gap-2 sm:grid-cols-[1fr_6rem_3rem_4rem] sm:gap-3";

const DURATION = 900;
const STAGGER = 45;

/** "0.36" -> 2 decimales, "1050" -> 0. Así no hay que duplicar el dato. */
function decimalsOf(amount: string): number {
  const dot = amount.indexOf(".");
  return dot === -1 ? 0 : amount.length - dot - 1;
}

/**
 * Las cantidades cuentan hasta su valor al entrar en pantalla, escalonadas.
 *
 * Un solo observer y un solo rAF para todo el grupo, escribiendo directo en el
 * DOM: con 26 filas, un componente animado por fila serían 26 re-renders de
 * React por frame. Así son cero.
 *
 * El servidor pinta los valores finales, así que sin JS —o con
 * `prefers-reduced-motion`— el dato correcto ya está desde el primer frame.
 */
export function NutrientRows({ rows }: { rows: readonly NutrientRow[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cells = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = rows.map((row) => ({
      value: Number.parseFloat(row.amount),
      decimals: decimalsOf(row.amount),
    }));

    // Arrancan en cero. La sección está bajo el pliegue, así que no se ve el salto.
    for (const [i, cell] of cells.current.entries()) {
      if (cell && Number.isFinite(targets[i]?.value)) cell.textContent = "0";
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();

        const startedAt = performance.now();
        const total = DURATION + STAGGER * rows.length;

        const step = (now: number) => {
          const elapsed = now - startedAt;

          for (const [i, cell] of cells.current.entries()) {
            const target = targets[i];
            if (!cell || !target || !Number.isFinite(target.value)) continue;
            const t = Math.min(1, Math.max(0, (elapsed - i * STAGGER) / DURATION));
            const eased = 1 - Math.pow(1 - t, 3);
            cell.textContent = (target.value * eased).toFixed(target.decimals);
          }

          if (elapsed < total) frame = requestAnimationFrame(step);
        };

        frame = requestAnimationFrame(step);
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [rows]);

  return (
    <div ref={containerRef}>
      {rows.map((row, i) => (
        <div
          key={row.name}
          className={`${GRID} border-b border-rule/70 py-2.5 transition-colors duration-200 hover:bg-card`}
        >
          <span className="pr-2 text-[13px] text-ink sm:text-sm">{row.name}</span>
          <span
            ref={(el) => {
              cells.current[i] = el;
            }}
            className="num text-right text-[13px] text-ink tabular-nums sm:text-sm"
          >
            {row.amount}
          </span>
          <span className="num text-left text-[11px] text-slate sm:text-xs">{row.unit}</span>
          <span className="num text-right text-[13px] text-ember-deep sm:text-sm">{row.vnr}</span>
        </div>
      ))}
    </div>
  );
}

export { GRID as NUTRIENT_GRID };
