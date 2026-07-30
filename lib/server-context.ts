import { cookies, headers } from "next/headers";
import {
  COOKIE_ATTRIBUTION,
  COOKIE_SESSION,
  COOKIE_VARIANT,
  RETURNING_AFTER_MS,
  decodeAttribution,
  deviceFromUserAgent,
  type Attribution,
  type Device,
} from "./attribution";
import { isPriceVariant, type PriceVariant } from "./pricing";

export type RequestContext = {
  sessionId: string;
  variant: PriceVariant;
  attribution: Attribution;
  device: Device;
  userAgent: string | null;
  /** true si la primera visita de esta cookie fue hace más de 30 minutos. */
  isReturning: boolean;
};

/**
 * El middleware garantiza que estas cookies existan antes de que corra cualquier
 * server component o route handler, así que la variante ya es estable.
 */
export async function getRequestContext(): Promise<RequestContext> {
  const [jar, head] = await Promise.all([cookies(), headers()]);
  const rawVariant = jar.get(COOKIE_VARIANT)?.value;
  const userAgent = head.get("user-agent");
  const attribution = decodeAttribution(jar.get(COOKIE_ATTRIBUTION)?.value);

  return {
    sessionId: jar.get(COOKIE_SESSION)?.value ?? "",
    variant: isPriceVariant(rawVariant) ? rawVariant : "A",
    attribution,
    device: deviceFromUserAgent(userAgent),
    userAgent: userAgent ? userAgent.slice(0, 400) : null,
    isReturning:
      attribution.first_seen !== null && Date.now() - attribution.first_seen > RETURNING_AFTER_MS,
  };
}
