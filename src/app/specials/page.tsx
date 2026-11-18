import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { business } from "@/data/business";
import { pad2 } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Specials",
  description: "Current specials at Rollings Automotive in Fullerton, CA — including 10% off for first-time customers. Call to confirm availability.",
  alternates: { canonical: "/specials" },
  openGraph: { url: "/specials", title: "Specials — Rollings Automotive" },
};

/** Offers as published on https://rollingsautomotive.com/specials/ */
const SPECIALS = [
  { title: "10% off for first-time customers", terms: "Cannot be combined with other offers. Must mention this offer." },
  { title: "Oil change special", terms: "Cannot be combined with other offers. Must mention this offer. Call for current pricing." },
  { title: "Free peanuts", terms: "Can be combined with other offers. Alternatives available for allergies." },
];

export default function SpecialsPage() {
  return (
    <>
      <PageHeader
        label="Limited-time specials"
        lines={["Save more with", <em key="r">Rollings.</em>]}
        intro="Specials may not be up to date — please call and inquire. We’re probably busy fixing your car."
        image="/images/stock/wheel-lowlight.jpg"
        imageAlt="Car wheel photographed in low light"
      >
        <Button href={business.phoneHref} icon="phone">Call to confirm</Button>
      </PageHeader>

      <section aria-label="Current specials" className="bg-ink py-24 md:py-32">
        <div className="wrap">
          <ol data-stagger>
            {SPECIALS.map((s, i) => (
              <li key={s.title} data-stagger-item className="grid gap-6 border-t border-line py-10 last:border-b md:grid-cols-12 md:items-center md:py-14">
                <span className="eyebrow md:col-span-1">{pad2(i + 1)}</span>
                <h2 className="display text-[clamp(1.9rem,4.4vw,4rem)] md:col-span-6">{s.title}</h2>
                <p className="text-sm leading-relaxed text-mute md:col-span-3">{s.terms}</p>
                <div className="md:col-span-2 md:justify-self-end">
                  <Button href="/contact" variant="text">Contact us</Button>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
