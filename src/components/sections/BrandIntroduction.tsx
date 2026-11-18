import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { Button } from "@/components/ui/Button";
import { business } from "@/data/business";

export function BrandIntroduction() {
  const years = new Date().getFullYear() - business.founded;
  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-hidden bg-ink py-24 md:py-36 lg:py-48">
      {/* Year detail */}
      <p
        aria-hidden
        className="pointer-events-none absolute -right-[4vw] top-10 select-none font-serif text-[clamp(8rem,30vw,30rem)] italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.07)]"
        data-parallax="18"
      >
        <span data-parallax-target className="block">1974</span>
      </p>

      <div className="wrap relative grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6 lg:pt-16">
          <SectionHeading
            id="about-title"
            chapter="02"
            label="Our story"
            lines={["Experience", "built over", <em key="g">generations.</em>]}
            className="[&_h2]:max-w-[12ch]"
          />

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:max-w-xl" data-stagger>
            <p data-stagger-item className="text-[0.98rem] leading-relaxed text-bone/85">
              Since {business.founded}, Rollings Automotive has been providing expert care for automobiles in Fullerton, California — an independent repair and maintenance shop for foreign and domestic makes.
            </p>
            <p data-stagger-item className="text-[0.98rem] leading-relaxed text-mute">
              “We do it all.” When in doubt, bring your car in for a free consultation. In the rare case we can’t fix your problem, we’ll happily refer you to one of the excellent shops nearby.
            </p>
          </div>

          <dl className="mt-14 grid max-w-xl grid-cols-2 border-t border-line" data-stagger>
            <div data-stagger-item className="border-r border-line py-6 pr-6">
              <dt className="eyebrow">Established</dt>
              <dd className="mt-3 text-4xl font-light tracking-tight md:text-5xl">{business.founded}</dd>
            </div>
            <div data-stagger-item className="py-6 pl-6">
              <dt className="eyebrow">Years in Fullerton</dt>
              <dd className="mt-3 text-4xl font-light tracking-tight md:text-5xl">{years}</dd>
            </div>
          </dl>

          <div className="mt-12" data-reveal="fade">
            <Button href="/contact" variant="text">Book a free consultation</Button>
          </div>
        </div>

        <div className="relative lg:col-span-5 lg:col-start-8">
          <ImageReveal
            src="/images/stock/technician-portrait.jpg"
            alt="Technician in work coveralls checking an engine in a well-lit repair bay"
            className="aspect-[4/5] w-full"
            sizes="(min-width: 1024px) 40vw, 100vw"
            parallax={10}
          />
          <p className="eyebrow mt-5 flex items-center justify-between" data-reveal="fade">
            <span>Foreign &amp; domestic</span>
            <span>Independent since {business.founded}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
