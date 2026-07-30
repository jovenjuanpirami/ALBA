"use client";

import { META_STANDARD_EVENTS, type EventName } from "./events";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type EventProperties = Record<string, string | number | boolean | null | undefined>;

/**
 * Dispara los tres destinos en paralelo. La tabla de primera parte es la fuente
 * de verdad; el pixel y GA4 van a perder eventos por bloqueadores y ATT.
 * session_id, variante, UTM y device los resuelve el servidor desde la cookie,
 * así que el cliente solo manda nombre y propiedades.
 */
export function track(name: EventName, properties: EventProperties = {}): void {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify({ event_name: name, properties });

  // 1. Primera parte.
  try {
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* nunca romper la UI por telemetría */
  }

  // 2. Meta Pixel.
  const standard = META_STANDARD_EVENTS[name];
  if (typeof window.fbq === "function") {
    if (standard) window.fbq("track", standard, properties);
    else window.fbq("trackCustom", name, properties);
  }

  // 3. GA4.
  if (typeof window.gtag === "function") {
    window.gtag("event", name, properties);
  }
}
