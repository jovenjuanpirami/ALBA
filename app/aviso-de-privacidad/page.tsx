import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Section";

export const metadata: Metadata = {
  title: "Aviso de privacidad · Alba",
  description:
    "Aviso de privacidad de Alba conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.",
  robots: { index: true, follow: true },
};

// TODO(legal): sustituir por la razón social, domicilio fiscal y correo reales
// antes de correr tráfico pagado. La LFPDPPP exige identificar al responsable.
const RESPONSABLE = {
  nombre: "[Razón social del responsable]",
  domicilio: "[Domicilio fiscal completo, México]",
  correo: "privacidad@[tudominio].mx",
};

const ULTIMA_ACTUALIZACION = "29 de julio de 2026";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-rule py-8">
      <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-slate">{children}</div>
    </section>
  );
}

export default function AvisoDePrivacidad() {
  return (
    <main className="pb-16">
      <Container className="pt-12 pb-8 sm:pt-16">
        <Link href="/" className="label-tracked text-ember-deep hover:underline">
          ← Volver a Alba
        </Link>
        <h1 className="mt-8 text-[clamp(2rem,6vw,3.5rem)] leading-[1.02] font-light tracking-tight">
          Aviso de privacidad
        </h1>
        <p className="label-mono mt-5">Última actualización · {ULTIMA_ACTUALIZACION}</p>
      </Container>

      <Container className="max-w-3xl">
        <Block title="1. Responsable de tus datos personales">
          <p>
            {RESPONSABLE.nombre}, con domicilio en {RESPONSABLE.domicilio}, es responsable del
            tratamiento de tus datos personales, en términos de la Ley Federal de Protección de
            Datos Personales en Posesión de los Particulares (LFPDPPP), su Reglamento y los
            Lineamientos del Aviso de Privacidad.
          </p>
        </Block>

        <Block title="2. Qué datos recabamos">
          <p>En este sitio recabamos únicamente:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong className="font-medium text-ink">Correo electrónico</strong>, que tú nos
              proporcionas al registrarte en la lista de espera.
            </li>
            <li>
              <strong className="font-medium text-ink">
                Monto que declaras estar dispuesto a pagar
              </strong>
              , si decides responder esa pregunta opcional.
            </li>
            <li>
              <strong className="font-medium text-ink">Datos de navegación</strong>: un
              identificador de sesión aleatorio guardado en una cookie propia, la variante de
              precio que se te mostró, los parámetros de campaña (UTM) con los que llegaste, el
              sitio de referencia, el tipo de dispositivo, el navegador y la ciudad aproximada
              derivada de tu dirección IP.
            </li>
          </ul>
          <p>
            <strong className="font-medium text-ink">
              No recabamos datos personales sensibles ni datos financieros o patrimoniales.
            </strong>{" "}
            Este sitio no procesa pagos y en ningún momento te pedimos datos de tarjeta.
          </p>
        </Block>

        <Block title="3. Para qué los usamos">
          <p>Finalidades primarias, necesarias para la relación que originas al registrarte:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Avisarte por correo cuando el producto esté disponible para pedido.</li>
            <li>Enviarte la confirmación de tu registro.</li>
            <li>
              Medir de forma agregada el interés en el producto y en cada nivel de precio, para
              decidir si lo fabricamos.
            </li>
          </ul>
          <p>Finalidad secundaria, a la que puedes oponerte sin afectar tu registro:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              Enviarte comunicaciones sobre el lanzamiento, promociones y contenidos de la marca.
            </li>
          </ul>
          <p>
            Para oponerte a la finalidad secundaria basta responder cualquier correo nuestro con la
            palabra <span className="num text-ink">BAJA</span> o escribirnos a{" "}
            {RESPONSABLE.correo}.
          </p>
        </Block>

        <Block title="4. Transferencias">
          <p>
            No vendemos, rentamos ni comercializamos tus datos personales. Los compartimos
            únicamente con proveedores que los tratan por cuenta nuestra y bajo instrucción
            nuestra, en calidad de encargados:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Supabase, Inc. — almacenamiento de la base de datos.</li>
            <li>Resend, Inc. — envío del correo de confirmación.</li>
            <li>Vercel, Inc. — hospedaje del sitio.</li>
            <li>
              Meta Platforms, Inc. y Google LLC — medición agregada de campañas, únicamente con
              datos de comportamiento, no con tu correo.
            </li>
          </ul>
          <p>
            Estas transferencias no requieren tu consentimiento conforme al artículo 37 de la
            LFPDPPP, al tratarse de encargados que actúan por cuenta del responsable.
          </p>
        </Block>

        <Block title="5. Tus derechos ARCO">
          <p>
            Puedes solicitar en cualquier momento el <strong className="font-medium text-ink">
              Acceso
            </strong>
            , <strong className="font-medium text-ink">Rectificación</strong>,{" "}
            <strong className="font-medium text-ink">Cancelación</strong> u{" "}
            <strong className="font-medium text-ink">Oposición</strong> al tratamiento de tus datos,
            así como revocar el consentimiento que nos otorgaste.
          </p>
          <p>
            Escribe a <span className="num text-ink">{RESPONSABLE.correo}</span> desde el mismo
            correo con el que te registraste, indicando qué derecho deseas ejercer. Te responderemos
            en un plazo máximo de 20 días hábiles y, si procede, lo haremos efectivo dentro de los
            15 días hábiles siguientes.
          </p>
          <p>
            Si consideras que tu derecho a la protección de datos fue vulnerado, puedes acudir a la
            autoridad competente en materia de protección de datos personales.
          </p>
        </Block>

        <Block title="6. Cookies">
          <p>
            Usamos una cookie propia con un identificador de sesión aleatorio, la variante de precio
            asignada y los parámetros de campaña, con una vigencia de 90 días. No contiene tu
            nombre, tu correo ni ningún dato que te identifique directamente. Puedes borrarla desde
            la configuración de tu navegador; si lo haces, es posible que veas un precio distinto en
            una visita posterior, porque la asignación de variante se hará de nuevo.
          </p>
          <p>
            Si activamos Meta Pixel o Google Analytics 4, esos servicios instalan sus propias
            cookies conforme a sus políticas de privacidad.
          </p>
        </Block>

        <Block title="7. Conservación">
          <p>
            Conservamos tu correo hasta que solicites su cancelación o hasta 24 meses después del
            cierre de este proceso de validación, lo que ocurra primero. Los datos de comportamiento
            se conservan de forma agregada para análisis histórico.
          </p>
        </Block>

        <Block title="8. Cambios a este aviso">
          <p>
            Cualquier modificación a este aviso se publicará en esta misma página, actualizando la
            fecha de la última versión. Si el cambio afecta las finalidades del tratamiento, te lo
            notificaremos por correo.
          </p>
        </Block>
      </Container>
    </main>
  );
}
