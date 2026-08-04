import Image from "next/image";
import powder from "@/media/powder.webp";

/**
 * Franja a todo lo ancho con el macro del polvo. Va entre la tabla de nutrientes
 * y la compra: cierra el argumento con la textura real, sin una sola palabra.
 */
export function PowderBand() {
  return (
    <div className="relative h-40 w-full overflow-hidden border-b border-rule sm:h-56 lg:h-72">
      <Image
        src={powder}
        alt="Detalle macro del polvo de Alba"
        placeholder="blur"
        sizes="100vw"
        fill
        className="object-cover"
      />
    </div>
  );
}
