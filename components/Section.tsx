export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <p className="label-mono mb-8 flex items-center gap-3">
      <span className="text-ember-deep">{index}</span>
      <span className="h-px w-8 bg-rule" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

/** H2 estándar: Jost light, grande, tracking negativo. */
export function Heading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-[clamp(1.75rem,4.5vw,3rem)] leading-[1.04] font-light tracking-tight ${className}`}
    >
      {children}
    </h2>
  );
}
