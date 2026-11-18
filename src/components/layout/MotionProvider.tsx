"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { registerGsap, motionState, prefersReducedMotion } from "@/animations/gsap";
import { applyScrollReveals } from "@/animations/scrollAnimations";

/**
 * Owns Lenis smooth scrolling and the global scroll-reveal context.
 * Reveals are re-scanned and fully reverted on every route change.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Lenis lifecycle (once)
  useEffect(() => {
    const { gsap, ScrollTrigger } = registerGsap();
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -80 } });
    motionState.lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      motionState.lenis = null;
    };
  }, []);

  // Reveal scan per route
  useEffect(() => {
    const { gsap, ScrollTrigger } = registerGsap();
    if (!window.location.hash) {
      if (motionState.lenis) motionState.lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    }
    if (prefersReducedMotion()) return;

    let mm: ReturnType<typeof gsap.matchMedia> | undefined;
    const ctx = gsap.context(() => {
      mm = applyScrollReveals(document.body);
    });
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      mm?.revert();
      ctx.revert();
    };
  }, [pathname]);

  return <>{children}</>;
}
