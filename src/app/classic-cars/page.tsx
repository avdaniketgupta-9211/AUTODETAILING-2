import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { ClassicCarsSection } from "@/components/sections/ClassicCarsSection";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { Button } from "@/components/ui/Button";
import { Lines } from "@/components/ui/SectionHeading";
import { business } from "@/data/business";

export const metadata: Metadata = {
  title: "Classic Car Restoration in Fullerton, CA",
  description:
    "Classic car restorations and custom builds from Rollings Automotive in Fullerton, CA — meticulous attention to detail, beautiful finishes and free consultations.",
  alternates: { canonical: "/classic-cars" },
  openGraph: { url: "/classic-cars", title: "Classic Car Restoration — Rollings Automotive" },
};

export default function ClassicCarsPage() {
  return (
    <>
      <PageHeader
        label="Classic car restorations"
        lines={["Rolling", <em key="h">history.</em>]}
        intro="Rollings Automotive delivers some of the most reputable classic car restorations in Fullerton, CA. We pride ourselves on results our clients admire — and you’ll be surprised by our quality of work along with a quick turnaround."
        image="/images/business/silver-classic-car-1.png"
        imageAlt="Silver classic Chevrolet with polished wheels inside the Rollings Automotive shop"
      >
        <Button href="/contact?topic=classic">Get a quote</Button>
      </PageHeader>

      <section aria-labelledby="finishes-title" className="bg-ink py-24 md:py-36">
        <div className="wrap grid gap-16 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <p className="eyebrow mb-8" data-reveal="fade">Beautiful finishes</p>
            <h2 id="finishes-title" className="display text-[clamp(2rem,4.6vw,4.4rem)]" data-reveal="lines">
              <Lines lines={["The smallest", <em key="d">details.</em>]} />
            </h2>
            <p className="mt-8 max-w-md leading-relaxed text-bone/85" data-reveal="fade">
              We pay meticulous attention to the smallest details. We’re passionate about working with pieces of art from a time not too long ago — and we love to bring a piece of that history back onto our roads.
            </p>
          </div>
          <ImageReveal
            src="/images/business/green-car-chevrolet.png"
            alt="Green custom Chevrolet with pinstriped rear deck on the Rollings alignment rack"
            className="aspect-[4/3] md:col-span-6 md:col-start-7"
            parallax={8}
          />
        </div>
        <div className="wrap mt-24 grid gap-16 md:mt-36 md:grid-cols-12 md:gap-10">
          <ImageReveal
            src="/images/business/classic-car-jurassic-side.png"
            alt="Red and silver Jeep Wrangler in a custom film-inspired livery"
            className="aspect-[4/3] md:col-span-6"
            parallax={8}
          />
          <div className="md:col-span-5 md:col-start-8 md:self-center">
            <p className="eyebrow mb-8" data-reveal="fade">Great for custom builds</p>
            <h2 className="display text-[clamp(2rem,4.6vw,4.4rem)]" data-reveal="lines">
              <Lines lines={["Your vision,", <em key="v">realized.</em>]} />
            </h2>
            <p className="mt-8 max-w-md leading-relaxed text-bone/85" data-reveal="fade">
              We love to have fun and work with unique cars. Whatever your ideas and visions are, we’re here to help you bring them to life.
            </p>
          </div>
        </div>
      </section>

      <ClassicCarsSection chapter="Gallery" />

      <section aria-labelledby="quote-title" className="border-t border-line bg-ink py-24 text-center md:py-36">
        <div className="wrap">
          <p className="eyebrow" data-reveal="fade">Get a quote today</p>
          <h2 id="quote-title" className="display mx-auto mt-8 max-w-[18ch] text-[clamp(2.2rem,5.6vw,5.4rem)]" data-reveal="lines">
            <Lines lines={["Our consultations", <em key="f">are free.</em>]} />
          </h2>
          <p className="mx-auto mt-8 max-w-md text-mute" data-reveal="fade">
            Or just come in and bother us. We’d love to chat about your car.
          </p>
          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row" data-reveal="fade">
            <Button href="/contact?topic=classic">Request a consultation</Button>
            <Button href={business.phoneHref} variant="outline" icon="phone">{business.phoneDisplay}</Button>
          </div>
        </div>
      </section>
    </>
  );
}
