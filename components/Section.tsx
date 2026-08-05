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
    <p className="label-mono mb-7 flex items-center gap-3">
      <span className="num text-ember-deep">{index}</span>
      <span className="h-px w-10 bg-rule" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

/** H2 estándar: serif editorial, grande y con mucho aire. */
export function Heading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`text-[clamp(2rem,5vw,3.5rem)] ${className}`}>{children}</h2>
  );
}
