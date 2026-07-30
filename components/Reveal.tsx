"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  /** Retardo en ms, para escalonar hijos. */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "tr" | "span";
};

/**
 * Revelado al entrar en viewport. Una sola vez, con IntersectionObserver
 * (sin listeners de scroll). `prefers-reduced-motion` lo neutraliza en CSS.
 */
export function Reveal({ children, delay = 0, className = "", as = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Tag = as as "div";

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={`reveal ${shown ? "reveal-in" : ""} ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
