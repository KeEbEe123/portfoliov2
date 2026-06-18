import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const ITEMS = [
  { image: "/dump/dump-1.png", label: "2K25 Innovation Challenge — Certificate" },
  { image: "/dump/dump-2.png", label: "Sword of the Sea — Champion" },
  { image: "/dump/dump-3.png", label: "Samurai poster design" },
  { image: "/dump/dump-4.png", label: "Samurai poster design" },
  { image: "/dump/dump-5.png", label: "Samurai poster design" },
];

export default function BeyondCode() {
  return (
    <section
      id="beyond"
      className="scroll-mt-20 border-t border-border bg-card/30 py-16 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="05 — Beyond code"
          title="Certificates & creative work"
          subtitle="Awards, design, and the occasional poster."
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {ITEMS.map((item, i) => (
            <Reveal key={item.image} delay={i * 0.05}>
              <figure className="group relative overflow-hidden rounded-xl border border-border bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.label}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-3 text-xs text-white transition-transform duration-300 group-hover:translate-y-0">
                  {item.label}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
