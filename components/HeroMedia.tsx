"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

type Connection = { saveData?: boolean; effectiveType?: string };

/**
 * La imagen es la base y siempre está: se pinta desde el servidor, así que no
 * hay hueco ni salto de layout. El video se monta encima solo cuando vale la
 * pena — pantalla grande, sin ahorro de datos y sin `prefers-reduced-motion` —
 * y aparece con un fundido cuando ya puede reproducirse.
 */
export function HeroMedia({ poster, alt }: { poster: StaticImageData; alt: string }) {
  const [wantsVideo, setWantsVideo] = useState(false);
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && /(^|-)2g$/.test(connection.effectiveType)) return;

    setWantsVideo(true);
  }, []);

  return (
    <div className="relative aspect-4/5 w-full overflow-hidden rounded-lg bg-paper-deep sm:aspect-16/10 lg:aspect-video">
      <Image
        src={poster}
        alt={alt}
        placeholder="blur"
        priority
        sizes="(min-width: 1152px) 1088px, 92vw"
        className={`h-full w-full object-cover transition-opacity duration-1000 ease-dawn ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      />

      {wantsVideo ? (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-dawn ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
        />
      ) : null}
    </div>
  );
}
