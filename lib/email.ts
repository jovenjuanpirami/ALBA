import { Resend } from "resend";
import { formatMXN, getTier, type Tier } from "./pricing";

/**
 * Correo de confirmación. Texto corto, sin diseño elaborado.
 * Repite el precio que vio y deja claro que todavía no hay cargo.
 */
export async function sendWaitlistConfirmation(input: {
  email: string;
  tier: Tier;
  priceShown: number;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[email:sin-resend] confirmación pendiente para ${input.email}`);
    }
    return;
  }

  const tier = getTier(input.tier);
  const price = formatMXN(input.priceShown);
  const priceLine = tier.recurring
    ? `${tier.name}: ${price} al mes (${tier.contents})`
    : `${tier.name}: ${price} (${tier.contents})`;

  const text = [
    "Listo, tu lugar está reservado.",
    "",
    "Alba todavía no está a la venta. Estamos confirmando el lote inicial y te vamos a",
    "escribir por correo en cuanto abramos pedidos, con el precio que viste:",
    "",
    priceLine,
    "",
    "No hay ningún cargo ni compromiso. Si decides que no, ignoras el correo y ya.",
    "",
    "Gracias por entrar temprano.",
    "",
    "Juan Pablo",
    "Alba · Suplemento alimenticio hecho en México",
    "",
    "Puedes darte de baja respondiendo a este correo.",
  ].join("\n");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? "Alba <onboarding@resend.dev>",
    to: input.email,
    replyTo: process.env.RESEND_REPLY_TO || undefined,
    subject: "Tu lugar en Alba está reservado",
    text,
  });

  if (error) {
    // El registro ya quedó guardado: un fallo de correo no debe romper el submit.
    console.error("[email] Resend falló:", error.message);
  }
}
