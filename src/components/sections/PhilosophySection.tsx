import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { principles } from "@/data/business";
import { pad2 } from "@/lib/utils";

export function PhilosophySection() {
  return (
    <section aria-labelledby="philosophy-title" className="relative border-t border-line bg-ink-2 py-24 md:py-36 lg:py-44">
      <div className="wrap">
        <SectionHeading
            id="philosophy-title"
          chapter="03"
          label="Our philosophy"
          size="md"
          lines={["Precision is not an option.", <em key="s">It is our standard.</em>]}
        />

        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <ImageReveal
                src="/images/stock/diagnostics.jpg"
                alt="Mechanic diagnosing an engine with a handheld diagnostic tool"
                className="aspect-[4/5] w-full lg:aspect-[5/6]"
                sizes="(min-width: 1024px) 38vw, 100vw"
                parallax={8}
              />
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-mute" data-reveal="fade">
                Honesty, integrity — standing by our work — doing our best, and doing everything we can for our customers.
              </p>
            </div>
          </div>

          <ol className="lg:col-span-6 lg:col-start-7" data-stagger>
            {principles.map((p, i) => (
              <li key={p.title} data-stagger-item className="group grid grid-cols-[3rem_1fr] gap-4 border-t border-line py-8 last:border-b md:grid-cols-[5rem_1fr] md:py-10">
                <span className="eyebrow pt-2 text-accent">{pad2(i + 1)}</span>
                <div>
                  <h3 className="text-[clamp(1.4rem,2.4vw,2.1rem)] font-light uppercase tracking-[-0.02em] transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:translate-x-2">
                    {p.title}
                  </h3>
                  <p className="mt-3 max-w-lg text-[0.95rem] leading-relaxed text-mute">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
