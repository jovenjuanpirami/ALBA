"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  to: number;
  decimals?: 0 | 1;
  durationMs?: number;
  className?: string;
};

/**
 * Cuenta hasta el número cuando entra en viewport.
 * El servidor pinta el valor final, así que si no hay JS o el usuario pidió
 * menos movimiento, el número correcto ya está ahí desde el primer frame.
 */
export function CountUp({ to, decimals = 0, durationMs = 1000, className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(to);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    setDisplay(0);

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();

        const startedAt = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - startedAt) / durationMs);
          // easeOutCubic: arranca rápido y frena, se siente mecánico y no elástico.
          setDisplay(to * (1 - Math.pow(1 - t, 3)));
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, durationMs]);

  return (
    <span ref={ref} className={className}>
      {display.toFixed(decimals)}
    </span>
  );
}
