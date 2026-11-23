import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { services, additionalServices } from "@/data/services";
import { business } from "@/data/business";
import { PageHeader } from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { ContactSection } from "@/components/sections/ContactSection";
import { cn, pad2 } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Auto Repair & Maintenance Services",
  description:
    "Engine repair, brakes, oil changes, tire rotation, wheel alignment, suspension, batteries, transmission, electronics, A/C, hybrid service, smog checks and towing in Fullerton, CA.",
  alternates: { canonical: "/services" },
  openGraph: { url: "/services", title: "Services — Rollings Automotive, Fullerton CA" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        label="Services · All makes, foreign & domestic"
        lines={["Every detail.", "Every", <em key="c">component.</em>]}
        intro="All types of auto maintenance and repairs. When in doubt, bring your car in for a free consultation — and if we can’t fix it, we’ll refer you to a shop that can."
        image="/images/stock/engine-repair.jpg"
        imageAlt="Technician repairing an engine inside an open engine bay"
      >
        <Button href={business.phoneHref} icon="phone">{business.phoneDisplay}</Button>
      </PageHeader>

      <section aria-label="Service list" className="bg-ink py-20 md:py-32">
        <div className="wrap">
          <nav aria-label="Jump to a service" className="mb-20 flex flex-wrap gap-x-6 gap-y-3 border-y border-line py-6" data-reveal="fade">
            {services.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="u-link pb-0.5 text-xs uppercase tracking-[0.2em] text-mute hover:text-bone">
                {s.name}
              </Link>
            ))}
          </nav>

          <div className="grid gap-24 md:gap-32">
            {services.map((s, i) => (
              <article key={s.slug} id={s.slug} className="grid scroll-mt-28 items-center gap-10 md:grid-cols-12 md:gap-10">
                <div className={cn("relative aspect-[4/3] overflow-hidden bg-ink-2 md:col-span-7", i % 2 && "md:order-2 md:col-start-6")} data-reveal="clip">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 768px) 58vw, 100vw"
                    className="tone object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-soft)] hover:scale-[1.04]"
                  />
                </div>
                <div className={cn("md:col-span-4", i % 2 ? "md:order-1 md:col-start-1" : "md:col-start-9")}>
                  <p className="eyebrow" data-reveal="fade">{pad2(i + 1)} / {pad2(services.length)}</p>
                  <h2 className="display mt-5 text-[clamp(2rem,4vw,3.6rem)]" data-reveal="lines">
                    <span className="line"><span>{s.name}</span></span>
                  </h2>
                  <p className="mt-6 text-[1rem] leading-relaxed text-mute" data-reveal="fade">{s.summary}</p>
                  <div className="mt-8" data-reveal="fade">
                    <Button href="/contact" variant="text">Ask about {s.name.toLowerCase()}</Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-32 grid gap-8 border-t border-line pt-12 md:grid-cols-12" data-reveal="fade">
            <h2 className="eyebrow md:col-span-3">Also available</h2>
            <p className="text-2xl font-light md:col-span-5">{additionalServices.join(" · ")}</p>
            <p className="text-sm leading-relaxed text-mute md:col-span-4">
              Don’t see what you need here? We can probably still help. Give us a call at{" "}
              <a href={business.phoneHref} className="u-link text-bone">{business.phoneDisplay}</a>.
            </p>
          </div>
        </div>
      </section>

      <ContactSection showChapter={false} />
    </>
  );
}
