"use client";

import { useEffect, useRef } from "react";
import { registerGsap, prefersReducedMotion } from "@/animations/gsap";
import { playHeroIntro } from "@/animations/heroAnimations";
import { VideoBackground } from "@/components/ui/VideoBackground";
import { Button } from "@/components/ui/Button";

const HERO_SOURCES = [
  { src: "/videos/hero-1080.mp4", minWidth: 1400 },
  { src: "/videos/hero-720.mp4", minWidth: 700 },
  { src: "/videos/hero-360.mp4", minWidth: 0 },
];

const WORDMARK = "ROLLINGS".split("");

export function HeroSection() {
  const rootRef = useRef<HTMLElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLParagraphElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    if (prefersReducedMotion()) {
      if (curtainRef.current) curtainRef.current.style.display = "none";
      return;
    }

    let seen = false;
    try {
      seen = sessionStorage.getItem("rollings-intro") === "1";
      sessionStorage.setItem("rollings-intro", "1");
    } catch {
      /* storage unavailable */
    }
    if (seen && curtainRef.current) curtainRef.current.style.display = "none";

    const ctx = gsap.context(() => {
      playHeroIntro({
        curtain: seen ? null : curtainRef.current,
        logo: seen ? null : logoRef.current,
        media: mediaRef.current,
        root,
      });

      // Scroll-out: content drifts and dims as the next chapter arrives.
      gsap.to(contentRef.current, {
        yPercent: -12,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom 30%", scrub: true },
      });
      gsap.to(mediaRef.current, {
        scale: 1.08,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} aria-labelledby="hero-title" className="grain relative h-[100svh] min-h-[600px] overflow-hidden bg-ink">
      {/* Intro curtain */}
      <div
        ref={curtainRef}
        aria-hidden
        className="intro-curtain pointer-events-none fixed inset-0 z-[60] grid place-items-center bg-ink"
      >
        <p ref={logoRef} className="flex overflow-hidden text-[clamp(1.6rem,5vw,3rem)] font-light tracking-[0.5em] text-bone">
          {WORDMARK.map((c, i) => (
            <span key={i} className="inline-block">
              {c}
            </span>
          ))}
        </p>
      </div>

      {/* Media */}
      <div ref={mediaRef} className="absolute inset-0">
        <VideoBackground
          sources={HERO_SOURCES}
          poster="/images/hero-poster.jpg"
          posterAlt="Black luxury sedan moving through a dark city street at night"
          priority
          showControl={false}
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,17,18,0.55)_0%,rgba(16,17,18,0.15)_35%,rgba(16,17,18,0.35)_65%,rgba(16,17,18,0.96)_100%)]" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_70%,rgba(16,17,18,0.6),transparent_60%)]" />
      </div>

      {/* Content */}
      <div ref={contentRef} className="wrap relative z-10 flex h-full flex-col justify-end pb-[max(5.5rem,11vh)] pt-28">
        <p data-hero-fade className="eyebrow mb-6 flex items-center gap-4 text-bone/80 md:mb-8">
          <span aria-hidden className="h-px w-10 bg-bone/50" />
          Established 1974 · Fullerton, California
        </p>

        <h1 id="hero-title" className="display max-w-[16ch] text-[clamp(2.9rem,8.2vw,9rem)] leading-[0.9]">
          <span className="line hero-line"><span>Automotive</span></span>
          <span className="line hero-line"><span>Excellence.</span></span>
          <span className="line hero-line"><span className="text-bone/60">Without</span></span>
          <span className="line hero-line"><span><em>compromise.</em></span></span>
        </h1>

        <div className="mt-8 flex flex-col gap-8 md:mt-12 md:flex-row md:items-end md:justify-between">
          <p data-hero-fade className="max-w-md text-[0.98rem] leading-relaxed text-bone/80 md:text-lg">
            Experience, precision and integrity in every vehicle we care for.
          </p>
          <div data-hero-fade className="flex flex-col gap-3 sm:flex-row">
            <Button href="/services">Explore our services</Button>
            <Button href="/contact" variant="outline">Contact our team</Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div data-hero-fade aria-hidden className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
        <span className="text-[0.6rem] uppercase tracking-[0.35em] text-bone/60">Scroll</span>
        <span className="relative block h-12 w-px overflow-hidden bg-bone/15">
          <span className="scroll-cue absolute inset-0 bg-bone/80" />
        </span>
      </div>
    </section>
  );
}
