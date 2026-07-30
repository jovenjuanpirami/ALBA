"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/track";
import { scrollPercent } from "@/lib/scroll";

const DEPTHS = [25, 50, 75, 100] as const;

/** page_view, scroll_depth y exit_intent. No renderiza nada. */
export function Instrumentation() {
  const fired = useRef(false);
  const reachedDepths = useRef<Set<number>>(new Set());
  const maxScroll = useRef(0);
  const exitFired = useRef(false);

  useEffect(() => {
    // React 18+ en modo estricto monta dos veces en dev: el ref evita el doble page_view.
    if (fired.current) return;
    fired.current = true;

    track("page_view", {
      referrer: document.referrer || "direct",
      landing_path: window.location.pathname,
    });
  }, []);

  useEffect(() => {
    let queued = false;

    const measure = () => {
      queued = false;
      const percent = scrollPercent();
      if (percent > maxScroll.current) maxScroll.current = percent;
      for (const depth of DEPTHS) {
        if (percent >= depth && !reachedDepths.current.has(depth)) {
          reachedDepths.current.add(depth);
          track("scroll_depth", { depth });
        }
      }
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Solo desktop: el mouse sale por arriba de la ventana.
    if (!window.matchMedia("(min-width: 640px) and (pointer: fine)").matches) return;

    const onLeave = (event: MouseEvent) => {
      if (exitFired.current) return;
      if (event.clientY > 0 || event.relatedTarget) return;
      exitFired.current = true;
      track("exit_intent", { max_scroll: maxScroll.current });
    };

    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, []);

  return null;
}
