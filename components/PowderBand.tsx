import Image from "next/image";
import powder from "@/media/powder.webp";
import { Container } from "./Section";

/**
 * Panel ancho con el macro del polvo. Va entre la tabla de nutrientes y la
 * compra: cierra el argumento con la textura real, sin una sola palabra.
 */
export function PowderBand() {
  return (
    <Container className="py-8 sm:py-12">
      <div className="relative h-44 w-full overflow-hidden rounded-xl sm:h-64 lg:h-80">
        <Image
          src={powder}
          alt="Detalle macro del polvo de Alba"
          placeholder="blur"
          sizes="(min-width: 1152px) 1088px, 92vw"
          fill
          className="object-cover"
        />
      </div>
    </Container>
  );
}
