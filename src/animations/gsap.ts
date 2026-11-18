"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

let registered = false;

export function registerGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: "power3.out", duration: 1 });
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

/** Shared runtime state (Lenis instance) for components such as back-to-top. */
export const motionState: { lenis: Lenis | null } = { lenis: null };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function scrollToTarget(target: number | string | HTMLElement) {
  const reduced = prefersReducedMotion();
  if (motionState.lenis) {
    motionState.lenis.scrollTo(target, { immediate: reduced, duration: 1.4 });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
  else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }
}

export { gsap, ScrollTrigger };
