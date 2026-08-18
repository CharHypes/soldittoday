import Image from "next/image";

/**
 * RelocationArt ... the Relocation hero visual.
 *
 * A brand illustration of Michigan (mulberry watercolor with a gold edge) showing
 * a dotted route leading to a location pin on Southeast Michigan. Framed as a
 * print against the dark aurora hero. Served through next/image so the large
 * source is optimized and responsive.
 */
export default function RelocationArt() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:ml-auto lg:mr-0">
      <div className="overflow-hidden rounded-xl2 border border-auroraMauve/25 shadow-aurora">
        <Image
          src="/assets/relocation/michigan-location.png"
          alt="Map of Michigan with a route leading to a location pin on Southeast Michigan"
          width={1448}
          height={1086}
          className="block h-auto w-full"
          priority
          sizes="(min-width: 1024px) 36rem, 100vw"
        />
      </div>
    </div>
  );
}
