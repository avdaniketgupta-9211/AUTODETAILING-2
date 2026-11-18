"use client";

import { ArrowUp } from "lucide-react";
import { scrollToTarget } from "@/animations/gsap";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => {
        scrollToTarget(0);
        document.querySelector<HTMLElement>("[data-site-nav] a")?.focus({ preventScroll: true });
      }}
      className="group inline-flex min-h-11 items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-mute transition-colors hover:text-bone"
    >
      Back to top
      <span className="grid size-10 place-items-center rounded-full border border-line transition-colors group-hover:border-bone">
        <ArrowUp className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" strokeWidth={1.5} aria-hidden />
      </span>
    </button>
  );
}
