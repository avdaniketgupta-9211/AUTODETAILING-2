"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { mainNav } from "@/data/navigation";
import { business } from "@/data/business";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 400 && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href));

  return (
    <>
      <header
        data-site-nav
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-700 ease-[var(--ease-cine)]",
          scrolled ? "border-b border-line bg-ink/95" : "border-b border-transparent bg-transparent",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <nav aria-label="Primary" className="wrap flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
          <Link href="/" className="group flex items-baseline gap-3" aria-label="Rollings Automotive — home">
            <span className="text-[1.05rem] font-semibold uppercase tracking-[0.42em] text-bone">Rollings</span>
            <span className="hidden text-[0.6rem] uppercase tracking-[0.3em] text-mute sm:inline">Est. 1974</span>
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "u-link pb-1 text-[0.7rem] font-medium uppercase tracking-[0.22em] transition-colors",
                    isActive(item.href) ? "text-bone [background-size:100%_1px]" : "text-mute hover:text-bone",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={business.phoneHref}
              className="group hidden min-h-11 items-center gap-2.5 border border-line px-5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-bone transition-colors duration-500 hover:border-bone hover:bg-bone hover:text-ink sm:inline-flex"
            >
              <Phone className="size-3.5" strokeWidth={1.5} aria-hidden />
              Call Now
            </a>
            <a
              href={business.phoneHref}
              className="grid size-11 place-items-center border border-line text-bone sm:hidden"
              aria-label={`Call ${business.phoneDisplay}`}
            >
              <Phone className="size-4" strokeWidth={1.5} aria-hidden />
            </a>
            <button
              type="button"
              className="grid size-11 place-items-center lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="relative block h-3 w-6" aria-hidden>
                <span className={cn("absolute left-0 top-0 h-px w-6 bg-bone transition-transform duration-500", open && "translate-y-1.5 rotate-45")} />
                <span className={cn("absolute bottom-0 left-0 h-px w-6 bg-bone transition-transform duration-500", open && "-translate-y-1.5 -rotate-45")} />
              </span>
            </button>
          </div>
        </nav>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} isActive={isActive} />
    </>
  );
}
