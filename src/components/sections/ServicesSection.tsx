"use client";

import Image from "next/image";
import { useState } from "react";
import { services } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceItem } from "@/components/ui/ServiceItem";
import { Button } from "@/components/ui/Button";
import { cn, pad2 } from "@/lib/utils";

export function ServicesSection() {
  const [active, setActive] = useState(0);
  const current = services[active];

  return (
    <section id="services" aria-labelledby="services-title" className="relative border-t border-line bg-ink py-24 md:py-36 lg:py-44">
      <div className="wrap">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="services-title"
            chapter="04"
            label="Automotive services"
            size="md"
            lines={["Every detail.", "Every component.", <em key="j">Every journey.</em>]}
          />
          <p className="max-w-sm text-[0.95rem] leading-relaxed text-mute" data-reveal="fade">
            All types of maintenance and repair — all makes, domestic and foreign. Don’t see what you need? Call us; we can probably still help.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          {/* Image stage (desktop) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28 aspect-[4/5] w-full overflow-hidden bg-ink-2" data-reveal="clip">
              {services.map((s, i) => (
                <Image
                  key={s.slug}
                  src={s.image}
                  alt={i === active ? s.alt : ""}
                  aria-hidden={i !== active}
                  fill
                  sizes="40vw"
                  className={cn(
                    "tone object-cover transition-[opacity,transform] duration-[1100ms] ease-[var(--ease-out-soft)]",
                    i === active ? "scale-100 opacity-100" : "scale-[1.06] opacity-0",
                  )}
                />
              ))}
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/90 to-transparent" />
              <div className="absolute inset-x-6 bottom-6 flex items-end justify-between" aria-live="polite">
                <span className="text-sm font-medium uppercase tracking-[0.2em] text-bone">{current.name}</span>
                <span className="eyebrow">
                  {pad2(active + 1)} / {pad2(services.length)}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ul data-stagger>
              {services.map((s, i) => (
                <ServiceItem key={s.slug} service={s} index={i} active={i === active} onActivate={() => setActive(i)} />
              ))}
            </ul>
            <div className="mt-12 flex flex-col gap-3 sm:flex-row" data-reveal="fade">
              <Button href="/services">View all services</Button>
              <Button href="tel:+17148706900" variant="outline" icon="phone">(714) 870-6900</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
