import { brands } from "@/data/business";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Typographic wordmarks only — no manufacturer logos, no implied affiliation. */
export function BrandsSection() {
  return (
    <section aria-labelledby="brands-title" className="relative border-t border-line bg-ink-2 py-24 md:py-36">
      <div className="wrap">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="brands-title"
            chapter="07"
            label="Vehicles we service"
            size="md"
            lines={["All makes.", <em key="f">Foreign &amp; domestic.</em>]}
          />
          <p className="max-w-sm text-[0.95rem] leading-relaxed text-mute" data-reveal="fade">
            Through our years of experience we’ve worked on all makes. As an independent repair and maintenance shop, we’re confident working with:
          </p>
        </div>

        <ul className="mt-16 grid grid-cols-2 border-l border-t border-line sm:grid-cols-3 lg:grid-cols-5" data-stagger>
          {brands.map((b) => (
            <li
              key={b}
              data-stagger-item
              className="group relative flex aspect-[16/9] items-center justify-center overflow-hidden border-b border-r border-line px-3 sm:aspect-[2/1]"
            >
              <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-bone transition-transform duration-700 ease-[var(--ease-cine)] group-hover:scale-y-100" />
              <span className="relative text-center text-[clamp(0.85rem,1.5vw,1.2rem)] font-medium uppercase tracking-[0.28em] text-bone/75 transition-colors duration-500 group-hover:text-ink">
                {b}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-mute/80" data-reveal="fade">
          Rollings Automotive is an independent repair shop and is not affiliated with, authorized by or endorsed by any vehicle manufacturer. Brand names are trademarks of their respective owners. We always honor factory-recommended services and maintenance contracts.
        </p>
      </div>
    </section>
  );
}
