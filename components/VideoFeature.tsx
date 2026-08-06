"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "./Section";

type Connection = { saveData?: boolean; effectiveType?: string };

/**
 * El video, nítido y grande, justo después de los tres pasos: lees cómo se
 * prepara y enseguida lo ves.
 *
 * Es el mismo archivo que usa el fondo del hero, así que en desktop ya viene
 * del caché y no cuesta una segunda descarga. Se monta solo cuando se acerca a
 * la pantalla, y nunca con ahorro de datos o en 2G.
 */
export function VideoFeature() {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = frameRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && /(^|-)2g$/.test(connection.effectiveType)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setMounted(true);
        observer.disconnect();
      },
      // Arranca la descarga un poco antes de que se vea, para que no llegue tarde.
      { rootMargin: "600px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-8 sm:py-12">
      <Container>
        <div
          ref={frameRef}
          className="relative aspect-4/5 w-full overflow-hidden rounded-xl bg-paper-deep sm:aspect-16/10 lg:aspect-video"
        >
          {mounted ? (
            <video
              className={`h-full w-full object-cover transition-opacity duration-1000 ease-dawn ${
                ready ? "opacity-100" : "opacity-0"
              }`}
              src="/hero.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              tabIndex={-1}
              aria-label="Alba preparado, listo para salir"
              onCanPlay={() => setReady(true)}
            />
          ) : null}

          {/* Una pizca de tinta abajo para que la leyenda se despegue del video. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-ink/45 to-transparent"
          />
          <p className="label-tracked absolute bottom-6 left-6 text-paper/90 sm:bottom-8 sm:left-8">
            Sesenta segundos · Eso es todo
          </p>
        </div>
      </Container>
    </section>
  );
}
