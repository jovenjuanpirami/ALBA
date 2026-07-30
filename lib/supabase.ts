import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de servicio. SOLO se importa desde código de servidor
 * (route handlers y server components). SUPABASE_SERVICE_ROLE_KEY no lleva
 * prefijo NEXT_PUBLIC_, así que nunca puede terminar en el bundle del cliente.
 */

let cached: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient | null {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "X-Client-Info": "alba-landing" } },
  });
  return cached;
}

export function supabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
