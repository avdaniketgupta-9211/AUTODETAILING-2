"use client";

import { gsap, ScrollTrigger } from "./gsap";

/**
 * Declarative motion language. Server components opt in with data attributes:
 *  data-reveal="lines"   → children `.line > span` slide up in sequence
 *  data-reveal="fade"    → soft rise + fade
 *  data-reveal="clip"    → clip-path wipe + inner image settle
 *  data-stagger          → `[data-stagger-item]` children rise in sequence
 *  data-parallax="12"    → inner `[data-parallax-target]` drifts by n% (desktop only)
 *  data-footer-mark      → large wordmark rises as the footer enters
 * Must be called inside a gsap.context so everything reverts on route change.
 */
export function applyScrollReveals(root: HTMLElement) {
  const q = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T & HTMLElement>(sel));
  const start = "top 85%";

  q("[data-reveal='lines']").forEach((el) => {
    const lines = el.querySelectorAll(".line > span");
    if (!lines.length) return;
    gsap.from(lines, {
      yPercent: 110,
      duration: 1.2,
      stagger: 0.09,
      ease: "power4.out",
      scrollTrigger: { trigger: el, start, once: true },
    });
  });

  q("[data-reveal='fade']").forEach((el) => {
    gsap.from(el, {
      y: 28,
      opacity: 0,
      duration: 1.1,
      delay: Number(el.dataset.delay ?? 0),
      scrollTrigger: { trigger: el, start, once: true },
    });
  });

  q("[data-reveal='clip']").forEach((el) => {
    const media = el.querySelector("img, video");
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    tl.fromTo(
      el,
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.inOut" },
    );
    if (media) tl.from(media, { scale: 1.18, duration: 1.8, ease: "power3.out" }, 0);
  });

  q("[data-stagger]").forEach((el) => {
    const items = el.querySelectorAll("[data-stagger-item]");
    if (!items.length) return;
    gsap.from(items, {
      y: 36,
      opacity: 0,
      duration: 1,
      stagger: 0.07,
      scrollTrigger: { trigger: el, start, once: true },
    });
  });

  const mm = gsap.matchMedia();
  mm.add("(min-width: 768px)", () => {
    q("[data-parallax]").forEach((el) => {
      const target = el.querySelector("[data-parallax-target]") ?? el;
      const amount = Number(el.dataset.parallax || 10);
      gsap.fromTo(
        target,
        { yPercent: -amount / 2 },
        {
          yPercent: amount / 2,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
  });

  q("[data-footer-mark]").forEach((el) => {
    gsap.from(el, {
      yPercent: 40,
      opacity: 0.2,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: true },
    });
  });

  ScrollTrigger.refresh();
  return mm;
}
