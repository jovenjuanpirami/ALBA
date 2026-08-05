"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import fallback from "@/media/lifestyle-vainilla.webp";

type Connection = { saveData?: boolean; effectiveType?: string };

/**
 * El fondo del hero: video disuelto detrás del texto.
 *
 * La imagen es la capa base y se pinta desde el servidor, así que el hero nunca
 * arranca vacío. El video se monta encima solo si vale la pena —pantalla ancha,
 * sin ahorro de datos, sin `prefers-reduced-motion`— y entra con un fundido
 * largo. En móvil no se descargan los 5 MB.
 *
 * Encima van dos velos de papel: uno plano y uno que se funde hacia abajo, para
 * que el hero se derrita en la página y el texto en tinta mantenga contraste AA
 * pase lo que pase en el video.
 */
export function HeroBackdrop() {
  const [wantsVideo, setWantsVideo] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && /(^|-)2g$/.test(connection.effectiveType)) return;

    setWantsVideo(true);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <Image
        src={fallback}
        alt=""
        placeholder="blur"
        priority
        fill
        sizes="100vw"
        className={`settle object-cover transition-opacity duration-[1500ms] ease-dawn ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      />

      {wantsVideo ? (
        <video
          className={`settle absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-dawn ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
        />
      ) : null}

      {/* Velo plano: garantiza el contraste del texto pase lo que pase detrás. */}
      <div className="absolute inset-0 bg-paper/72" />
      {/* Y el degradado que lo derrite en la página. */}
      <div className="absolute inset-0 bg-linear-to-b from-paper/60 via-paper/40 to-paper" />
      <div className="dawn-glow absolute inset-x-0 -top-1/4 h-[80%] opacity-45" />
    </div>
  );
}
