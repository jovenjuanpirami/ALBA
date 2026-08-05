"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatMXN, formatPrice, getTier } from "@/lib/pricing";
import { getFlavor } from "@/lib/product";
import { track } from "@/lib/track";
import { SunMark } from "./Logo";
import { useStore } from "./Store";

type Step = "email" | "wtp";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Mismo tope que valida /api/waitlist, para que el mensaje salga antes del viaje. */
const MAX_WTP = 100_000;

export function WaitlistModal() {
  const { purchase, variant, closeWaitlist } = useStore();
  const router = useRouter();

  const dialogRef = useRef<HTMLDivElement>(null);
  const openedAt = useRef<number>(0);
  const completed = useRef(false);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false); // nunca premarcada
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);
  const [wtp, setWtp] = useState("");

  const titleId = useId();
  const descId = useId();
  const open = purchase !== null;

  /** Cierre sin registrarse. */
  const dismiss = useCallback(() => {
    if (!completed.current && openedAt.current > 0) {
      const secondsOpen = Math.round((Date.now() - openedAt.current) / 1000);
      track("waitlist_modal_dismiss", { seconds_open: secondsOpen });
    }
    closeWaitlist();
  }, [closeWaitlist]);

  // Alta del modal: reset de estado, evento de vista, foco inicial y bloqueo de scroll.
  useEffect(() => {
    if (!purchase) return;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    openedAt.current = Date.now();
    completed.current = false;
    setStep("email");
    setError(null);
    setSubmitting(false);
    setRecordId(null);
    setWtp("");
    setConsent(false);

    track("waitlist_modal_view", { sku: purchase.flavor, tier: purchase.tier });

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTarget = dialogRef.current?.querySelector<HTMLElement>("input[type='email']");
    focusTarget?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      restoreFocusTo.current?.focus?.();
    };
  }, [purchase]);

  // Escape cierra. Tab queda atrapado dentro del diálogo.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
        return;
      }
      if (event.key !== "Tab") return;

      const node = dialogRef.current;
      if (!node) return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const activeEl = document.activeElement;

      if (event.shiftKey && (activeEl === first || !node.contains(activeEl))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeEl === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open, dismiss]);

  if (!purchase) return null;

  // Capturado en un const para que el estrechamiento sobreviva dentro de los handlers.
  const active = purchase;
  const tier = getTier(active.tier);
  const priceLabel = formatPrice(active.tier, variant);

  async function submitEmail(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!/^[^\s@]+@[^\s@,;]+\.[a-z]{2,}$/i.test(email.trim())) {
      setError("Escribe un correo válido.");
      return;
    }
    if (!consent) {
      setError("Marca la casilla para que podamos avisarte.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          consent: true,
          sku: active.flavor,
          tier: active.tier,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        id?: string | null;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        setError(data.error ?? "No pudimos guardar tu correo. Inténtalo otra vez.");
        setSubmitting(false);
        return;
      }

      completed.current = true;
      setRecordId(data.id ?? null);
      track("waitlist_submit", {
        sku: active.flavor,
        tier: active.tier,
        price_shown: active.priceShown,
      });
      setStep("wtp");
    } catch {
      setError("Falló la conexión. Inténtalo otra vez.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitWtp(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    // Vacío = "prefiero no decir". Sale sin registrar respuesta.
    const raw = wtp.trim();
    if (raw === "") {
      finish();
      return;
    }

    // Validamos en JS y no con los atributos del input, para que el mensaje
    // salga en español y no el del navegador.
    const amount = Number.parseInt(raw.replace(/[^\d]/g, ""), 10);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Escribe una cantidad en pesos, solo números.");
      return;
    }
    if (amount > MAX_WTP) {
      setError("Esa cantidad se ve fuera de rango.");
      return;
    }

    track("wtp_submit", { amount });
    void fetch("/api/waitlist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: recordId, wtp: amount }),
      keepalive: true,
    }).catch(() => {});
    finish();
  }

  function finish() {
    closeWaitlist();
    router.push("/gracias");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Cerrar"
        tabIndex={-1}
        onClick={dismiss}
        className="animate-dawn-rise absolute inset-0 cursor-default bg-ink/50"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="animate-dawn-rise relative z-10 max-h-[92dvh] w-full overflow-y-auto rounded-t-lg bg-card px-5 pt-6 pb-8 sm:max-w-lg sm:rounded-lg sm:px-9 sm:pt-8 sm:pb-9"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <SunMark className="h-4" animate />
            <p className="label-mono">{step === "email" ? "Preventa" : "Registro confirmado"}</p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="-mt-1 -mr-1 p-1.5 text-slate transition-colors hover:text-ink"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </button>
        </div>

        {step === "email" ? (
          <>
            <h2
              id={titleId}
              className="mt-6 text-[1.75rem] sm:text-[2rem]"
            >
              Todavía no está a la venta.
            </h2>

            <div id={descId} className="mt-5 space-y-3.5 text-[15px] leading-relaxed text-slate">
              <p>
                Alba se lanza en las próximas semanas. Estamos confirmando el lote inicial y
                queremos que los primeros en probarlo sean los que ya lo pidieron.
              </p>
              <p>
                Déjanos tu correo y te avisamos en cuanto abramos pedidos, con el precio que acabas
                de ver garantizado.
              </p>
            </div>

            <div className="mt-6 rounded-pill border border-rule bg-paper px-4 py-3.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="label-mono">Precio reservado</span>
                <span className="num text-[15px] text-ink">{priceLabel}</span>
              </div>
              <p className="mt-1.5 text-[12px] text-slate">
                {getFlavor(active.flavor).name} · {tier.contents}
              </p>
            </div>

            <form onSubmit={submitEmail} className="mt-7" noValidate>
              <label htmlFor="waitlist-email" className="label-mono block">
                Correo electrónico
              </label>
              <input
                id="waitlist-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "waitlist-error" : undefined}
                className="mt-2.5 w-full rounded-pill border border-ink bg-card px-4 py-3.5 text-[15px] text-ink transition-colors placeholder:text-slate/55 focus:border-ember"
                placeholder="tu@correo.com"
              />

              <label className="mt-4 flex cursor-pointer items-start gap-3 text-[13px] leading-snug text-slate">
                <input
                  type="checkbox"
                  name="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-ember"
                />
                <span>
                  Acepto recibir información sobre el lanzamiento. Consulta el{" "}
                  <a
                    href="/aviso-de-privacidad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ember-deep underline underline-offset-2"
                  >
                    aviso de privacidad
                  </a>
                  .
                </span>
              </label>

              {error ? (
                <p id="waitlist-error" role="alert" className="mt-4 text-[13px] text-ember-deep">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full rounded-pill bg-ink px-6 py-4 text-[15px] font-medium text-paper transition-colors duration-200 hover:bg-amber hover:text-ink disabled:opacity-60"
              >
                {submitting ? "Reservando…" : "Reservar mi lugar"}
              </button>

              <p className="mt-4 text-[12px] leading-relaxed text-slate">
                No hay pago ni cargo. No pedimos datos de tarjeta.
              </p>
            </form>
          </>
        ) : (
          <>
            <h2
              id={titleId}
              className="mt-6 text-[1.75rem] sm:text-[2rem]"
            >
              Una última pregunta, y nos ayuda muchísimo.
            </h2>
            <p id={descId} className="mt-5 text-[15px] leading-relaxed text-slate">
              ¿Cuánto pagarías por una bolsa de {tier.servings} porciones?
            </p>

            <form onSubmit={submitWtp} className="mt-7" noValidate>
              <label htmlFor="wtp-amount" className="label-mono block">
                Monto en pesos
              </label>
              <div className="mt-2.5 flex items-center gap-2 rounded-pill border border-ink bg-card px-4 py-3.5 focus-within:border-ember">
                <span className="num text-slate">$</span>
                <input
                  id="wtp-amount"
                  name="wtp"
                  // `type="text"` a propósito: con type="number" el navegador impone
                  // sus propias reglas de validación y las escribe en inglés.
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={7}
                  value={wtp}
                  onChange={(e) => setWtp(e.target.value.replace(/[^\d]/g, ""))}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "wtp-error" : undefined}
                  className="num w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-slate/55"
                  placeholder={String(active.priceShown)}
                />
                <span className="label-mono">MXN</span>
              </div>

              {error ? (
                <p id="wtp-error" role="alert" className="mt-3 text-[13px] text-ember-deep">
                  {error}
                </p>
              ) : null}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="flex-1 rounded-pill bg-ink px-6 py-4 text-[15px] font-medium text-paper transition-colors duration-200 hover:bg-amber hover:text-ink"
                >
                  Enviar
                </button>
                <button
                  type="button"
                  onClick={finish}
                  className="rounded-pill border border-rule px-6 py-4 text-[15px] text-slate transition-colors duration-200 hover:border-ink hover:text-ink"
                >
                  Prefiero no decir
                </button>
              </div>

              <p className="mt-4 text-[12px] leading-relaxed text-slate">
                Ya te apuntamos con {formatMXN(active.priceShown)} garantizado. Esta pregunta es
                opcional y solo nos sirve para calibrar el precio.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
