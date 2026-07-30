/**
 * Lista blanca de eventos. Compartida por el cliente y por /api/track:
 * la ruta rechaza cualquier event_name que no esté aquí.
 */

export const EVENT_NAMES = [
  "page_view",
  "scroll_depth",
  "sku_toggle",
  "nutrient_panel_open",
  "purchase_intent_click",
  "waitlist_modal_view",
  "waitlist_modal_dismiss",
  "waitlist_submit",
  "wtp_submit",
  "faq_open",
  "exit_intent",
] as const;

export type EventName = (typeof EVENT_NAMES)[number];

const EVENT_SET: ReadonlySet<string> = new Set(EVENT_NAMES);

export function isEventName(value: unknown): value is EventName {
  return typeof value === "string" && EVENT_SET.has(value);
}

/** Dónde vivía el botón que produjo el purchase_intent_click. */
export type ClickPosition = "hero" | "pricing_table" | "sticky_bar" | "footer";

/** Mapeo a eventos estándar de Meta Pixel. El resto va como trackCustom. */
export const META_STANDARD_EVENTS: Partial<Record<EventName, string>> = {
  purchase_intent_click: "InitiateCheckout",
  waitlist_submit: "Lead",
};
