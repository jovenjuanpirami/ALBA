/** Atribución de primer toque: se captura en la primera visita y sobrevive la navegación interna. */

export type Attribution = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  /** fbclid / gclid / ttclid: identifica el clic exacto del anuncio. */
  click_id: string | null;
  click_source: string | null;
  referrer: string | null;
  landing_path: string | null;
  /** Epoch ms de la primera visita. Sirve para distinguir visitante nuevo de recurrente. */
  first_seen: number | null;
};

export const EMPTY_ATTRIBUTION: Attribution = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_content: null,
  utm_term: null,
  click_id: null,
  click_source: null,
  referrer: null,
  landing_path: null,
  first_seen: null,
};

export const COOKIE_SESSION = "alba_sid";
export const COOKIE_VARIANT = "alba_variant";
export const COOKIE_ATTRIBUTION = "alba_attr";
export const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 90; // 90 días

/** Una visita se considera recurrente si su primera visita fue hace más de 30 min. */
export const RETURNING_AFTER_MS = 30 * 60 * 1000;

const MAX_FIELD = 180;

/** Parámetros de clic que ponen las plataformas de anuncios. */
const CLICK_ID_PARAMS = [
  ["fbclid", "meta"],
  ["gclid", "google"],
  ["gbraid", "google"],
  ["wbraid", "google"],
  ["ttclid", "tiktok"],
  ["msclkid", "microsoft"],
  ["twclid", "x"],
] as const;

function clean(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, MAX_FIELD);
  return trimmed.length ? trimmed : null;
}

function cleanNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/** base64url de JSON, seguro para cookie y para el header Cookie que reinyecta el middleware. */
export function encodeAttribution(attr: Attribution): string {
  const json = JSON.stringify(attr);
  return btoa(encodeURIComponent(json))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeAttribution(raw: string | undefined): Attribution {
  if (!raw) return EMPTY_ATTRIBUTION;
  try {
    const b64 = raw.replace(/-/g, "+").replace(/_/g, "/");
    const parsed = JSON.parse(decodeURIComponent(atob(b64))) as Partial<Attribution>;
    return {
      utm_source: clean(parsed.utm_source),
      utm_medium: clean(parsed.utm_medium),
      utm_campaign: clean(parsed.utm_campaign),
      utm_content: clean(parsed.utm_content),
      utm_term: clean(parsed.utm_term),
      click_id: clean(parsed.click_id),
      click_source: clean(parsed.click_source),
      referrer: clean(parsed.referrer),
      landing_path: clean(parsed.landing_path),
      first_seen: cleanNumber(parsed.first_seen),
    };
  } catch {
    return EMPTY_ATTRIBUTION;
  }
}

export function attributionFromRequest(
  searchParams: URLSearchParams,
  referrer: string | null,
  pathname: string,
  now: number,
): Attribution {
  let clickId: string | null = null;
  let clickSource: string | null = null;
  for (const [param, source] of CLICK_ID_PARAMS) {
    const value = clean(searchParams.get(param));
    if (value) {
      clickId = value;
      clickSource = source;
      break;
    }
  }

  return {
    utm_source: clean(searchParams.get("utm_source")),
    utm_medium: clean(searchParams.get("utm_medium")),
    utm_campaign: clean(searchParams.get("utm_campaign")),
    utm_content: clean(searchParams.get("utm_content")),
    utm_term: clean(searchParams.get("utm_term")),
    click_id: clickId,
    click_source: clickSource,
    referrer: clean(referrer),
    landing_path: clean(pathname),
    first_seen: now,
  };
}

export type Device = "mobile" | "tablet" | "desktop";

export function deviceFromUserAgent(ua: string | null | undefined): Device {
  if (!ua) return "desktop";
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone|iPod|Windows Phone/i.test(ua)) return "mobile";
  return "desktop";
}
