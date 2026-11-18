"use client";

import { gsap } from "./gsap";

type HeroRefs = {
  curtain: HTMLElement | null;
  logo: HTMLElement | null;
  media: HTMLElement | null;
  root: HTMLElement;
};

/**
 * Cinematic intro: black → wordmark → video fades up → headline stagger →
 * supporting copy → CTAs → scroll cue. Total ≈ 2.8s.
 */
export function playHeroIntro({ curtain, logo, media, root }: HeroRefs) {
  const lines = root.querySelectorAll(".hero-line > span");
  const fades = root.querySelectorAll("[data-hero-fade]");
  const nav = document.querySelector("[data-site-nav]");

  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  if (curtain && logo) {
    const letters = logo.querySelectorAll("span");
    tl.set(curtain, { autoAlpha: 1 })
      .from(letters, { yPercent: 120, duration: 0.75, stagger: 0.04 })
      .to(letters, { yPercent: -120, duration: 0.6, stagger: 0.03, ease: "power3.in" }, "+=0.15")
      .to(curtain, { autoAlpha: 0, duration: 0.7, ease: "power2.inOut" }, "-=0.25");
  }

  if (media) tl.fromTo(media, { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 2.4, ease: "power2.out" }, curtain ? "-=0.7" : 0);
  if (nav) tl.from(nav, { y: -24, autoAlpha: 0, duration: 1 }, "<0.3");
  tl.from(lines, { yPercent: 115, duration: 1.1, stagger: 0.08 }, "<0.05");
  tl.from(fades, { y: 18, autoAlpha: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, "-=0.85");

  return tl;
}
