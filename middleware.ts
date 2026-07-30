import { NextResponse, type NextRequest } from "next/server";
import {
  COOKIE_ATTRIBUTION,
  COOKIE_MAX_AGE_SECONDS,
  COOKIE_SESSION,
  COOKIE_VARIANT,
  attributionFromRequest,
  encodeAttribution,
} from "@/lib/attribution";
import { isPriceVariant, type PriceVariant } from "@/lib/pricing";

/**
 * Asigna una sola vez: session_id, variante de precio (50/50) y atribución de
 * primer toque. Las cookies se reinyectan en el header de la petición actual
 * para que el server component ya renderice con la variante correcta.
 */
export function middleware(request: NextRequest) {
  const pending: { name: string; value: string }[] = [];

  let sessionId = request.cookies.get(COOKIE_SESSION)?.value;
  if (!sessionId || sessionId.length < 8) {
    sessionId = crypto.randomUUID();
    pending.push({ name: COOKIE_SESSION, value: sessionId });
  }

  const rawVariant = request.cookies.get(COOKIE_VARIANT)?.value;
  let variant: PriceVariant;
  if (isPriceVariant(rawVariant)) {
    variant = rawVariant;
  } else {
    variant = Math.random() < 0.5 ? "A" : "B";
    pending.push({ name: COOKIE_VARIANT, value: variant });
  }

  if (!request.cookies.get(COOKIE_ATTRIBUTION)?.value) {
    const attribution = attributionFromRequest(
      request.nextUrl.searchParams,
      request.headers.get("referer"),
      request.nextUrl.pathname,
      Date.now(),
    );
    pending.push({ name: COOKIE_ATTRIBUTION, value: encodeAttribution(attribution) });
  }

  const requestHeaders = new Headers(request.headers);
  if (pending.length > 0) {
    const existing = request.headers.get("cookie");
    const injected = pending.map((c) => `${c.name}=${c.value}`).join("; ");
    requestHeaders.set("cookie", existing ? `${existing}; ${injected}` : injected);
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  for (const cookie of pending) {
    response.cookies.set(cookie.name, cookie.value, {
      path: "/",
      maxAge: COOKIE_MAX_AGE_SECONDS,
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
