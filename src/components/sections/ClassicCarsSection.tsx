"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import { classicGallery } from "@/data/navigation";
import { registerGsap, prefersReducedMotion } from "@/animations/gsap";
import { Button } from "@/components/ui/Button";
import { Lines } from "@/components/ui/SectionHeading";
import { pad2 } from "@/lib/utils";

const PILLARS = [
  { title: "Restoration craftsmanship", body: "Results our clients admire — with a quality of work and turnaround that surprises." },
  { title: "Attention to detail", body: "We pay meticulous attention to the smallest details. Beautiful finishes are the point." },
  { title: "Classic vehicle care", body: "Pieces of art from a time not too long ago — we love bringing that history back onto our roads." },
  { title: "Custom builds", body: "We love unique cars. Whatever your ideas and visions are, we’re here to help bring them to life." },
];

/**
 * ScrollTrigger's `pin` wraps the section in a `pin-spacer` div. React must
 * revert that wrapper during the DOM-deletion commit (not in a deferred
 * passive effect), otherwise navigation throws `removeChild` and unmounts the
 * tree. Layout effects clean up synchronously before nodes are removed; the
 * isomorphic alias avoids an SSR warning.
 */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Props = { headingLevel?: "h1" | "h2"; chapter?: string };

export function ClassicCarsSection({ headingLevel = "h2", chapter = "05" }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const Heading = headingLevel;

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || prefersReducedMotion()) return;
    const { gsap } = registerGsap();

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const distance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      // Subtle inner drift on each frame as it crosses the viewport
      track.querySelectorAll<HTMLElement>("[data-drift]").forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -6 },
          {
            xPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="classic-cars" aria-labelledby="classic-title" className="relative overflow-hidden border-t border-line bg-ink-2 lg:h-[100svh]">
      <div
        ref={trackRef}
        className="flex flex-col gap-16 py-24 md:py-32 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-[4vw] lg:py-0 lg:pl-[var(--gutter)] lg:pr-[8vw]"
      >
        {/* Intro panel */}
        <div className="wrap flex shrink-0 flex-col justify-center lg:w-[42vw] lg:max-w-none lg:px-0">
          <p className="eyebrow mb-8 flex items-center gap-4" data-reveal="fade">
            <span className="text-bone">{chapter}</span>
            <span aria-hidden className="h-px w-10 bg-line" />
            Classic car restoration
          </p>
          <Heading id="classic-title" className="display text-[clamp(2.3rem,5.4vw,5.6rem)]" data-reveal="lines">
            <Lines lines={["Timeless", "machines deserve", <em key="c">exceptional care.</em>]} />
          </Heading>
          <p className="mt-8 max-w-md text-[0.98rem] leading-relaxed text-bone/80" data-reveal="fade">
            Rollings Automotive is known in Fullerton for classic car restoration — and for treating every one of these cars like the rolling history it is.
          </p>
          <p className="eyebrow mt-10 hidden items-center gap-3 lg:flex" aria-hidden>
            Scroll to explore <span className="h-px w-16 bg-line" />
          </p>
        </div>

        {/* Gallery frames — real Rollings Automotive photography */}
        {classicGallery.map((img, i) => {
          const tall = i % 3 === 1;
          return (
            <figure
              key={img.src}
              className={`wrap shrink-0 lg:max-w-none lg:px-0 ${tall ? "lg:w-[30vw] lg:self-start lg:pt-[12vh]" : "lg:w-[44vw] lg:self-end lg:pb-[10vh]"}`}
            >
              <div
                className={`relative w-full overflow-hidden bg-ink ${tall ? "aspect-[4/5] lg:aspect-auto lg:h-[62vh]" : "aspect-[4/3] lg:aspect-auto lg:h-[56vh]"}`}
                data-reveal="clip"
              >
                <div data-drift className="absolute -inset-x-[8%] inset-y-0">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="tone object-cover"
                  />
                </div>
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                <span className="eyebrow">{pad2(i + 1)}</span>
                <span className="text-sm text-bone/80">{img.caption}</span>
              </figcaption>
            </figure>
          );
        })}

        {/* Pillars + CTA panel */}
        <div className="wrap shrink-0 lg:w-[38vw] lg:max-w-none lg:px-0">
          <ul className="border-t border-line" data-stagger>
            {PILLARS.map((p) => (
              <li key={p.title} data-stagger-item className="border-b border-line py-6">
                <h3 className="text-lg font-light uppercase tracking-[-0.01em]">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{p.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 font-serif text-2xl italic text-bone/90">Our consultations are free.</p>
          <p className="mt-2 text-sm text-mute">Or just come in — we’d love to chat about your car.</p>
          <div className="mt-8">
            <Button href="/contact?topic=classic">Request a restoration consultation</Button>
          </div>
        </div>
      </div>

      {/* Progress rail (desktop) */}
      <div aria-hidden className="absolute bottom-8 left-[var(--gutter)] right-[var(--gutter)] hidden h-px bg-line lg:block">
        <span ref={progressRef} className="absolute inset-0 origin-left scale-x-0 bg-bone/70" />
      </div>
    </section>
  );
}
