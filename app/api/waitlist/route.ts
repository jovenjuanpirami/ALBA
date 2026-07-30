import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { sendWaitlistConfirmation } from "@/lib/email";
import { isTier, priceOf } from "@/lib/pricing";
import { isFlavor } from "@/lib/product";
import { getRequestContext } from "@/lib/server-context";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@,;]+\.[a-z]{2,}$/i;
const MAX_WTP = 100000;

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (email.length < 5 || email.length > 254 || !EMAIL_RE.test(email)) return null;
  return email;
}

/** POST — registra el correo en la waitlist. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { email: rawEmail, consent, sku, tier } = (body ?? {}) as Record<string, unknown>;

  const email = normalizeEmail(rawEmail);
  if (!email) {
    return NextResponse.json({ error: "Escribe un correo válido." }, { status: 400 });
  }

  // Consentimiento explícito, obligatorio (LFPDPPP). La casilla no viene premarcada.
  if (consent !== true) {
    return NextResponse.json(
      { error: "Necesitamos tu consentimiento para escribirte." },
      { status: 400 },
    );
  }

  if (!isTier(tier)) {
    return NextResponse.json({ error: "Paquete inválido." }, { status: 400 });
  }

  const ctx = await getRequestContext();
  if (!ctx.sessionId) {
    return NextResponse.json({ error: "Recarga la página e inténtalo de nuevo." }, { status: 400 });
  }

  // El precio no se acepta del cliente: se deriva de la variante en cookie.
  const priceShown = priceOf(tier, ctx.variant);
  const head = await headers();
  const cityGuess = head.get("x-vercel-ip-city");

  const supabase = getServiceClient();
  if (!supabase) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[waitlist:sin-supabase] ${email} · ${tier} · ${priceShown} MXN`);
      return NextResponse.json({ ok: true, id: null, duplicate: false });
    }
    return NextResponse.json({ error: "Servicio no disponible." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("waitlist")
    .insert({
      email,
      session_id: ctx.sessionId,
      sku_clicked: isFlavor(sku) ? sku : null,
      tier_clicked: tier,
      price_variant: ctx.variant,
      price_shown: priceShown,
      city_guess: cityGuess ? decodeURIComponent(cityGuess).slice(0, 80) : null,
      utm_source: ctx.attribution.utm_source,
      utm_medium: ctx.attribution.utm_medium,
      utm_campaign: ctx.attribution.utm_campaign,
      utm_content: ctx.attribution.utm_content,
      utm_term: ctx.attribution.utm_term,
      click_id: ctx.attribution.click_id,
      click_source: ctx.attribution.click_source,
      is_returning: ctx.isReturning,
      referrer: ctx.attribution.referrer,
      device: ctx.device,
    })
    .select("id")
    .single();

  if (error) {
    // 23505 = unique violation. Un correo repetido no es un error para el usuario.
    if (error.code === "23505") {
      const { data: existing } = await supabase
        .from("waitlist")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      return NextResponse.json({ ok: true, id: existing?.id ?? null, duplicate: true });
    }
    console.error("[waitlist] insert falló:", error.message);
    return NextResponse.json({ error: "No pudimos guardar tu correo." }, { status: 500 });
  }

  // El correo no bloquea la respuesta del formulario.
  await sendWaitlistConfirmation({ email, tier, priceShown }).catch(() => {});

  return NextResponse.json({ ok: true, id: data.id, duplicate: false });
}

/** PATCH — segundo paso opcional: disposición a pagar declarada. */
export async function PATCH(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { id, wtp } = (body ?? {}) as Record<string, unknown>;
  const amount = typeof wtp === "number" ? Math.round(wtp) : Number.NaN;

  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_WTP) {
    return NextResponse.json({ error: "Cantidad inválida." }, { status: 400 });
  }

  const supabase = getServiceClient();
  if (!supabase) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[wtp:sin-supabase] ${amount} MXN`);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Servicio no disponible." }, { status: 503 });
  }

  const ctx = await getRequestContext();
  const query = supabase.from("waitlist").update({ wtp_response: amount });

  // Preferimos el id devuelto por el POST; si no llegó, caemos a la sesión actual.
  const { error } =
    typeof id === "string" && id.length > 0
      ? await query.eq("id", id).is("wtp_response", null)
      : await query.eq("session_id", ctx.sessionId).is("wtp_response", null);

  if (error) {
    console.error("[wtp] update falló:", error.message);
    return NextResponse.json({ error: "No pudimos guardar tu respuesta." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
