import { NextResponse } from "next/server";
import { isEventName } from "@/lib/events";
import { getRequestContext } from "@/lib/server-context";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const MAX_PROPERTY_KEYS = 12;
const MAX_STRING_LENGTH = 200;

/** Solo primitivos, con tope de llaves y de longitud. Nada anidado entra a jsonb. */
function sanitizeProperties(input: unknown): Record<string, string | number | boolean> {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (Object.keys(out).length >= MAX_PROPERTY_KEYS) break;
    if (!/^[a-z0-9_]{1,40}$/i.test(key)) continue;
    if (typeof value === "string") out[key] = value.slice(0, MAX_STRING_LENGTH);
    else if (typeof value === "number" && Number.isFinite(value)) out[key] = value;
    else if (typeof value === "boolean") out[key] = value;
  }
  return out;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { event_name: eventName, properties } = (body ?? {}) as {
    event_name?: unknown;
    properties?: unknown;
  };

  // Lista blanca: cualquier otro nombre se rechaza antes de tocar la base.
  if (!isEventName(eventName)) {
    return NextResponse.json({ error: "event_name no permitido" }, { status: 422 });
  }

  const ctx = await getRequestContext();
  if (!ctx.sessionId) {
    return NextResponse.json({ error: "sesión ausente" }, { status: 400 });
  }

  const supabase = getServiceClient();
  if (!supabase) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[track:sin-supabase] ${eventName}`, sanitizeProperties(properties));
    }
    return new NextResponse(null, { status: 204 });
  }


  const enriched = sanitizeProperties(properties);
  // El servidor enriquece: el cliente no puede falsear procedencia ni recurrencia.
  if (eventName === "page_view") {
    enriched.is_returning = ctx.isReturning;
    if (ctx.attribution.click_source) enriched.click_source = ctx.attribution.click_source;
    if (ctx.attribution.click_id) enriched.click_id = ctx.attribution.click_id;
  }

  const { error } = await supabase.from("events").insert({
    session_id: ctx.sessionId,
    event_name: eventName,
    properties: enriched,
    price_variant: ctx.variant,
    utm_source: ctx.attribution.utm_source,
    utm_campaign: ctx.attribution.utm_campaign,
    device: ctx.device,
    user_agent: ctx.userAgent,
  });

  if (error) {
    console.error("[track] insert falló:", error.message);
    return NextResponse.json({ error: "no se pudo registrar" }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
