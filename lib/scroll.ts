"use client";

/** Porcentaje de la página realmente visto, 0–100. */
export function scrollPercent(): number {
  if (typeof window === "undefined") return 0;
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 100;
  const raw = ((window.scrollY || doc.scrollTop) / scrollable) * 100;
  return Math.min(100, Math.max(0, Math.round(raw)));
}
