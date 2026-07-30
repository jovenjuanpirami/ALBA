import type { Metadata } from "next";
import Link from "next/link";
import { SunMark } from "@/components/Logo";
import { Container } from "@/components/Section";

export const metadata: Metadata = {
  title: "Tu lugar está reservado · Alba",
  description: "Registro confirmado en la lista de espera de Alba.",
  robots: { index: false, follow: false },
};

export default function Gracias() {
  return (
    <main className="flex min-h-dvh flex-col justify-center">
      <Container className="max-w-2xl py-20">
        <SunMark className="h-9" animate />

        <p className="label-tracked mt-8 text-ember-deep">Registro confirmado</p>

        <h1 className="mt-5 text-[clamp(2rem,7vw,3.75rem)] leading-[1.02] font-light tracking-tight">
          Tu lugar está reservado.
        </h1>

        <div className="mt-8 space-y-4 text-[17px] leading-relaxed text-slate">
          <p>
            Te acabamos de enviar un correo de confirmación con el precio que viste. Si no llega en
            los próximos minutos, revisa tu carpeta de spam.
          </p>
          <p className="text-ink">
            Alba todavía no está a la venta y no hicimos ningún cargo. Te escribimos por correo en
            cuanto abramos pedidos.
          </p>
        </div>

        <dl className="mt-10 border-t border-rule">
          <div className="flex items-baseline justify-between gap-4 border-b border-rule py-3">
            <dt className="label-mono">Siguiente paso</dt>
            <dd className="num text-[13px] text-ink">Te escribimos nosotros</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-b border-rule py-3">
            <dt className="label-mono">Cargo a tu tarjeta</dt>
            <dd className="num text-[13px] text-ink">Ninguno</dd>
          </div>
        </dl>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xs border border-ink px-6 py-3.5 text-[15px] font-medium transition-colors duration-150 hover:bg-ink hover:text-paper"
          >
            Volver al inicio
          </Link>
          <Link
            href="/#panel-nutricional"
            className="inline-flex items-center justify-center rounded-xs border border-rule px-6 py-3.5 text-[15px] text-slate transition-colors duration-150 hover:border-ink hover:text-ink"
          >
            Ver los 26 nutrientes
          </Link>
        </div>

        <p className="mt-12 text-xs leading-relaxed text-slate">
          Suplemento alimenticio. Este producto no es un medicamento.
        </p>
      </Container>
    </main>
  );
}
