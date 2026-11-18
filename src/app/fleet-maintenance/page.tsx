import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { Button } from "@/components/ui/Button";
import { Lines } from "@/components/ui/SectionHeading";
import { ContactSection } from "@/components/sections/ContactSection";
import { fleetOfferings, fleetServices, fleetMisc } from "@/data/services";
import { pad2 } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Fleet Maintenance in Fullerton, CA",
  description:
    "Fleet maintenance from Rollings Automotive — preventative inspections, on-demand repairs, fast turnarounds and custom pricing and service plans for fleets of all sizes.",
  alternates: { canonical: "/fleet-maintenance" },
  openGraph: { url: "/fleet-maintenance", title: "Fleet Maintenance — Rollings Automotive" },
};

export default function FleetPage() {
  return (
    <>
      <PageHeader
        label="Fullerton fleet maintenance · Since 1974"
        lines={["Maximum uptime.", <em key="c">Minimum cost.</em>]}
        intro="Keep your drivers safe and your vehicles working for you, day in and day out. We work with fleets of all sizes and offer custom pricing and service plans."
        image="/images/stock/fleet-van-2.jpg"
        imageAlt="Commercial van parked beside a white concrete building"
      >
        <Button href="/contact?topic=fleet">Discuss fleet maintenance</Button>
      </PageHeader>

      <section aria-labelledby="provide-title" className="bg-ink py-24 md:py-36">
        <div className="wrap grid gap-16 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <p className="eyebrow mb-8" data-reveal="fade">Rollings Automotive can provide</p>
            <h2 id="provide-title" className="display text-[clamp(2rem,4.6vw,4.4rem)]" data-reveal="lines">
              <Lines lines={["Efficiency", "for your", <em key="w">workforce.</em>]} />
            </h2>
          </div>
          <ul className="md:col-span-6 md:col-start-7" data-stagger>
            {fleetOfferings.map((o, i) => (
              <li key={o} data-stagger-item className="flex items-baseline gap-6 border-t border-line py-6 last:border-b">
                <span className="eyebrow w-6">{pad2(i + 1)}</span>
                <span className="text-[clamp(1.15rem,2vw,1.6rem)] font-light">{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="experts-title" className="border-t border-line bg-ink-2 py-24 md:py-36">
        <div className="wrap grid gap-16 md:grid-cols-12 md:gap-10">
          <ImageReveal
            src="/images/stock/truck-engine.jpg"
            alt="Mechanic repairing a truck engine in an indoor workshop"
            className="aspect-[4/5] md:col-span-5"
            parallax={8}
          />
          <div className="grid gap-12 md:col-span-6 md:col-start-7 md:self-center">
            <div data-reveal="fade">
              <h2 id="experts-title" className="text-2xl font-light uppercase tracking-[-0.01em]">Experts of auto maintenance</h2>
              <p className="mt-4 leading-relaxed text-mute">
                Have an issue? We’ll be able to solve it. Our mechanics and technicians are experts — with in-depth knowledge and experience, we work to prevent problems before they happen.
              </p>
            </div>
            <div data-reveal="fade">
              <h3 className="text-2xl font-light uppercase tracking-[-0.01em]">Latest tools &amp; tech</h3>
              <p className="mt-4 leading-relaxed text-mute">
                Protect your fleet with the best in the market. We’ve invested heavily in the latest diagnostic tools, high-quality repair equipment and the best staff.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="fleet-services-title" className="border-t border-line bg-ink py-24 md:py-36">
        <div className="wrap">
          <p className="eyebrow mb-8" data-reveal="fade">Fleet maintenance services</p>
          <h2 id="fleet-services-title" className="display max-w-[20ch] text-[clamp(2rem,4.6vw,4.4rem)]" data-reveal="lines">
            <Lines lines={["Highest quality.", <em key="e">Cost-effective plans.</em>]} />
          </h2>
          <div className="mt-16 grid gap-px bg-line md:grid-cols-3" data-stagger>
            {fleetServices.map((s, i) => (
              <article key={s.title} data-stagger-item className="bg-ink p-8 md:p-10">
                <p className="eyebrow">{pad2(i + 1)}</p>
                <h3 className="mt-10 text-xl font-light uppercase tracking-[-0.01em]">{s.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-mute">{s.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-16 grid gap-6 border-t border-line pt-10 md:grid-cols-12" data-reveal="fade">
            <h3 className="eyebrow md:col-span-3">Miscellaneous services</h3>
            <p className="text-lg font-light leading-relaxed text-bone/85 md:col-span-9">{fleetMisc.join(" · ")}</p>
          </div>
        </div>
      </section>

      <ContactSection showChapter={false} />
    </>
  );
}
