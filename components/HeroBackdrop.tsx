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
      {/* Desenfoque fuerte: el video deja de ser una escena con caras y objetos
          que compiten con el titular, y pasa a ser luz y color en movimiento.
          El scale evita que se vean los bordes lavados por el blur. */}
      <div className="absolute inset-0 scale-115 blur-[36px]">
        <Image
          src={fallback}
          alt=""
          placeholder="blur"
          priority
          fill
          sizes="100vw"
          className={`settle object-cover transition-opacity duration-1500 ease-dawn ${
            ready ? "opacity-0" : "opacity-100"
          }`}
        />

        {wantsVideo ? (
          <video
            className={`settle absolute inset-0 h-full w-full object-cover transition-opacity duration-1500 ease-dawn ${
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
      </div>

      {/* Velo plano: garantiza el contraste del texto pase lo que pase detrás. */}
      <div className="absolute inset-0 bg-paper/78" />
      {/* Degradado que lo derrite hacia la página. */}
      <div className="absolute inset-0 bg-linear-to-b from-paper/55 via-paper/35 to-paper" />
      {/* Y un halo de papel justo detrás del bloque de texto. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 48% at 50% 42%, var(--color-paper) 0%, color-mix(in oklab, var(--color-paper) 55%, transparent) 55%, transparent 100%)",
        }}
      />
      <div className="dawn-glow absolute inset-x-0 -top-1/4 h-[80%] opacity-40" />
    </div>
  );
}
