/**
 * Marca ALBA — el sol saliendo sobre el horizonte.
 *
 * Es un ARCO (banda semicircular), no un semicírculo sólido: así viene impreso
 * en los siete renders del empaque, y manda el empaque porque es lo que ve el
 * cliente. Para volver a la versión sólida del kit original, cambia el <path>
 * por `d="M12 44 A 44 44 0 0 1 100 44 Z"` con fill en lugar de stroke.
 */

type MarkProps = {
  className?: string;
  /** Anima el amanecer del arco en la primera pintura. */
  animate?: boolean;
  /** Monocromo, para fondos oscuros o usos de una tinta. */
  mono?: "ink" | "paper" | null;
};

export function SunMark({ className = "h-8", animate = false, mono = null }: MarkProps) {
  const arcColor = mono === "ink" ? "#1C1A17" : mono === "paper" ? "#F5F2ED" : "url(#alba-dawn)";
  const ruleFill = mono === "paper" ? "#F5F2ED" : "#1C1A17";

  return (
    <svg
      viewBox="0 0 112 55"
      className={className}
      role="img"
      aria-label="Alba"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="alba-dawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8A340" />
          <stop offset="100%" stopColor="#C9762B" />
        </linearGradient>
      </defs>
      {/* El arco: el sol saliendo. */}
      <path
        d="M16.5 49.5 A 39.5 39.5 0 0 1 95.5 49.5"
        fill="none"
        stroke={arcColor}
        strokeWidth="11"
        strokeLinecap="butt"
        className={animate ? "animate-arc-draw" : undefined}
      />
      {/* Horizonte, más ancho que el arco. */}
      <rect
        x="0"
        y="51"
        width="112"
        height="3"
        fill={ruleFill}
        className={animate ? "animate-rule-draw" : undefined}
      />
    </svg>
  );
}

export function Wordmark({
  className = "text-xl",
  withNutrition = false,
}: {
  className?: string;
  withNutrition?: boolean;
}) {
  return (
    <span className="flex flex-col items-center">
      <span className={`wordmark leading-none ${className}`}>ALBA</span>
      {withNutrition ? (
        <span
          className="mt-2 font-display text-[0.5em] leading-none opacity-55"
          style={{ letterSpacing: "0.42em", textIndent: "0.42em" }}
        >
          NUTRITION
        </span>
      ) : null}
    </span>
  );
}

/** Lockup horizontal: marca · divisor · wordmark. El que va en el header. */
export function LogoLockup({
  className = "",
  markClass = "h-6",
  wordClass = "text-lg",
}: {
  className?: string;
  markClass?: string;
  wordClass?: string;
}) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <SunMark className={markClass} />
      <span className="h-5 w-px bg-rule" aria-hidden="true" />
      {/* 400 en lugar de 300: a 15-16px el peso light se ve lavado. */}
      <span className={`wordmark leading-none font-normal text-ink ${wordClass}`}>ALBA</span>
    </span>
  );
}
