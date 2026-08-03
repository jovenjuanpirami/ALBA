"use client";

import { useEffect, useRef, useState } from "react";
import { SERVING_OPTIONS, VNR_PER_SERVING } from "@/lib/product";

const RADIUS = 84;
const ARC_LENGTH = Math.PI * RADIUS;

const CAPTIONS: Record<number, string> = {
  1: "Una porción cubre el 30% del Valor Nutrimental de Referencia de los 26 nutrientes.",
  2: "Dos porciones, el 60%.",
  3: "Tres porciones, el 90% de tu día.",
};

/** Anima cualquier cambio de valor, venga del scroll o de un clic. */
function useTween(target: number, durationMs = 700): number {
  const [value, setValue] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      current.current = target;
      setValue(target);
      return;
    }

    const from = current.current;
    const startedAt = performance.now();
    let frame = 0;

    const step = (now: number) => {
      const t = Math.min(1, (now - startedAt) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (target - from) * eased;
      current.current = next;
      setValue(next);
      if (t < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}

/**
 * El amanecer como medidor: el mismo arco de la marca se llena para mostrar
 * cuánto del día cubre cada porción. Se anima solo al entrar en pantalla y
 * el usuario puede explorar 1, 2 o 3 porciones.
 */
export function DailyGauge() {
  const [servings, setServings] = useState<number>(1);
  const [visible, setVisible] = useState(true); // el servidor pinta 30%, no 0%
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setVisible(false);
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const target = visible ? servings * VNR_PER_SERVING : 0;
  const percent = useTween(target);
  const offset = ARC_LENGTH * (1 - Math.min(percent, 100) / 100);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative w-full max-w-[320px]">
        <svg viewBox="0 0 200 122" className="w-full" role="img" aria-hidden="true">
          <defs>
            <linearGradient id="gauge-dawn" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C9762B" />
              <stop offset="100%" stopColor="#E8A340" />
            </linearGradient>
          </defs>

          {/* El día completo. */}
          <path
            d={`M 16 100 A ${RADIUS} ${RADIUS} 0 0 1 184 100`}
            fill="none"
            stroke="var(--color-rule)"
            strokeWidth="12"
          />
          {/* Lo que cubre Alba. */}
          <path
            d={`M 16 100 A ${RADIUS} ${RADIUS} 0 0 1 184 100`}
            fill="none"
            stroke="url(#gauge-dawn)"
            strokeWidth="12"
            strokeLinecap="butt"
            strokeDasharray={ARC_LENGTH}
            strokeDashoffset={offset}
          />
          {/* El horizonte, igual que en la marca. */}
          <rect x="0" y="110" width="200" height="3" fill="var(--color-ink)" />
        </svg>

        <div className="absolute inset-x-0 bottom-5 flex flex-col items-center">
          <p className="num text-[2.5rem] leading-none text-ink">
            {Math.round(percent)}
            <span className="text-[1.25rem] text-slate">%</span>
          </p>
          <p className="label-mono mt-2">de tu día</p>
        </div>
      </div>

      <div
        role="group"
        aria-label="Porciones al día"
        className="mt-8 inline-flex rounded-xs border border-rule bg-card p-1"
      >
        {SERVING_OPTIONS.map((option) => {
          const active = option === servings;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => setServings(option)}
              className={`num rounded-xs px-4 py-2 text-[12px] tracking-[0.14em] uppercase transition-colors duration-300 ${
                active ? "bg-ink text-paper" : "text-slate hover:text-ink"
              }`}
            >
              {option} {option === 1 ? "porción" : "porciones"}
            </button>
          );
        })}
      </div>

      <p
        key={servings}
        className="animate-dawn-rise mt-6 max-w-sm text-center text-[14px] leading-relaxed text-slate"
        aria-live="polite"
      >
        {CAPTIONS[servings]}
      </p>
    </div>
  );
}
