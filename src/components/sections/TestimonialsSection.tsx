"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { Lines } from "@/components/ui/SectionHeading";
import { cn, pad2 } from "@/lib/utils";

export function TestimonialsSection() {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((p) => (p + d + testimonials.length) % testimonials.length);

  return (
    <section aria-labelledby="reviews-title" className="relative border-t border-line bg-ink-2 py-24 md:py-36 lg:py-44">
      <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-8 flex items-center gap-4" data-reveal="fade">
            <span className="text-bone">09</span>
            <span aria-hidden className="h-px w-10 bg-line" />
            Customer experiences
          </p>
          <h2 id="reviews-title" className="display text-[clamp(2rem,4vw,3.6rem)]" data-reveal="lines">
            <Lines lines={["Trust is built", "one journey", <em key="t">at a time.</em>]} />
          </h2>
          <p className="mt-8 max-w-xs text-sm text-mute" data-reveal="fade">
            In their own words — reviews published on the Rollings Automotive website.
          </p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6" data-reveal="fade">
          <div className="grid" aria-live="polite">
            {testimonials.map((t, idx) => (
              <figure
                key={t.name}
                aria-hidden={idx !== i}
                className={cn(
                  "col-start-1 row-start-1 transition-[opacity,transform] duration-[900ms] ease-[var(--ease-out-soft)]",
                  idx === i ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
                )}
              >
                <span aria-hidden className="block font-serif text-7xl leading-none text-accent/60">“</span>
                <blockquote className="mt-2 font-serif text-[clamp(1.5rem,2.8vw,2.6rem)] leading-[1.22] text-bone">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-10 flex items-center gap-4 text-sm">
                  <span aria-hidden className="h-px w-10 bg-line" />
                  <span className="font-semibold uppercase tracking-[0.2em] text-bone">{t.name}</span>
                  <span className="text-mute">{t.date}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-14 flex items-center justify-between border-t border-line pt-6">
            <div className="flex gap-6" aria-label="Choose a testimonial">
              {testimonials.map((t, idx) => (
                <button
                  key={t.name}
                  type="button"
                  aria-pressed={idx === i}
                  aria-label={`Testimonial from ${t.name}`}
                  onClick={() => setI(idx)}
                  className={cn("min-h-11 text-xs tracking-[0.2em] transition-colors", idx === i ? "text-bone" : "text-mute hover:text-bone")}
                >
                  {pad2(idx + 1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" className="group grid size-12 place-items-center rounded-full border border-line transition-colors hover:border-bone">
                <ArrowLeft className="size-4 transition-transform duration-500 group-hover:-translate-x-0.5" strokeWidth={1.5} aria-hidden />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next testimonial" className="group grid size-12 place-items-center rounded-full border border-line transition-colors hover:border-bone">
                <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
