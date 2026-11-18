import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { business } from "@/data/business";
import { Lines } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/ui/ContactForm";
import { Button } from "@/components/ui/Button";

type Props = { headingLevel?: "h1" | "h2"; showChapter?: boolean };

export function ContactSection({ headingLevel = "h2", showChapter = true }: Props) {
  const Heading = headingLevel;
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative border-t border-line bg-ink py-24 md:py-36 lg:py-44">
      <div className="wrap">
        <p className="eyebrow mb-8 flex items-center gap-4" data-reveal="fade">
          {showChapter && <span className="text-bone">10</span>}
          <span aria-hidden className="h-px w-10 bg-line" />
          Contact &amp; consultation
        </p>
        <Heading id="contact-title" className="display max-w-[18ch] text-[clamp(2.3rem,6.4vw,6.2rem)]" data-reveal="lines">
          <Lines lines={["Your vehicle", "deserves the", <em key="h">right hands.</em>]} />
        </Heading>

        <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <ul className="border-t border-line" data-stagger>
              <li data-stagger-item className="border-b border-line">
                <a href={business.phoneHref} className="group flex items-center justify-between gap-4 py-6">
                  <span className="flex items-center gap-5">
                    <Phone className="size-4 text-mute" strokeWidth={1.5} aria-hidden />
                    <span>
                      <span className="eyebrow block">Call</span>
                      <span className="mt-1 block text-2xl font-light tracking-tight md:text-3xl">{business.phoneDisplay}</span>
                    </span>
                  </span>
                  <ArrowUpRight className="size-5 text-mute transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone" strokeWidth={1.25} aria-hidden />
                </a>
              </li>
              <li data-stagger-item className="border-b border-line">
                <a href={business.emailHref} className="group flex items-center justify-between gap-4 py-6">
                  <span className="flex min-w-0 items-center gap-5">
                    <Mail className="size-4 shrink-0 text-mute" strokeWidth={1.5} aria-hidden />
                    <span className="min-w-0">
                      <span className="eyebrow block">Email</span>
                      <span className="mt-1 block break-all text-lg font-light md:text-xl">{business.email}</span>
                    </span>
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 text-mute transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone" strokeWidth={1.25} aria-hidden />
                </a>
              </li>
              <li data-stagger-item className="border-b border-line">
                <a href={business.mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 py-6">
                  <span className="flex items-center gap-5">
                    <MapPin className="size-4 text-mute" strokeWidth={1.5} aria-hidden />
                    <span>
                      <span className="eyebrow block">Directions</span>
                      <span className="mt-1 block text-lg font-light md:text-xl">
                        {business.address.street}, {business.address.city}, {business.address.region} {business.address.postalCode}
                      </span>
                    </span>
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 text-mute transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone" strokeWidth={1.25} aria-hidden />
                  <span className="sr-only">(opens Google Maps in a new tab)</span>
                </a>
              </li>
            </ul>

            <div className="mt-10" data-reveal="fade">
              <h3 className="eyebrow mb-4">Business hours</h3>
              <dl className="divide-y divide-line border-y border-line">
                {business.hours.map((h) => (
                  <div key={h.label} className="flex justify-between py-3 text-sm">
                    <dt className="text-mute">{h.label}</dt>
                    <dd className="text-bone">{h.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-10 border border-line p-6" data-reveal="fade">
              <p className="font-serif text-2xl italic">Consultations are free.</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">When in doubt, just bring your car in. Prefer to talk first? Give us a call.</p>
              <div className="mt-6">
                <Button href={business.phoneHref} variant="outline" icon="phone">Call for a consultation</Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7" data-reveal="fade">
            <div className="bg-ink-2 p-6 sm:p-10">
              <h3 className="mb-8 text-lg font-light uppercase tracking-[-0.01em]">Send us a message</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
