"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { ArrowUpRight, ChevronDown, Phone } from "lucide-react";
import { mainNav } from "@/data/navigation";
import { business } from "@/data/business";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const servicesTrigger = useRef<HTMLButtonElement>(null);
  const firstServiceLink = useRef<HTMLAnchorElement>(null);
  /** prevents the trigger's bubbling onFocus from reopening after Escape */
  const suppressFocusOpen = useRef(false);
  const hydrated = useRef(false);

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

  useEffect(() => {
    // Only close on real route changes — never right after mount, which would
    // race with a fast click on the hamburger or Services trigger.
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    const id = setTimeout(() => {
      setOpen(false);
      setServicesOpen(false);
    }, 0);
    return () => clearTimeout(id);
  }, [pathname]);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href));

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const openServices = () => {
    if (suppressFocusOpen.current) {
      suppressFocusOpen.current = false;
      return;
    }
    cancelClose();
    setServicesOpen(true);
  };
  const closeServicesSoon = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setServicesOpen(false), 180);
  };
  const onServicesBlur = (e: FocusEvent<HTMLLIElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) closeServicesSoon();
  };
  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setServicesOpen(true);
      setTimeout(() => firstServiceLink.current?.focus(), 0);
    }
  };
  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      suppressFocusOpen.current = true;
      setServicesOpen(false);
      servicesTrigger.current?.focus();
    }
  };

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
            {mainNav.map((item) =>
              item.href === "/services" ? (
                <li
                  key={item.href}
                  className="relative"
                  onMouseEnter={openServices}
                  onMouseLeave={closeServicesSoon}
                  onFocus={openServices}
                  onBlur={onServicesBlur}
                >
                  <div className="flex items-center">
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
                    <button
                      ref={servicesTrigger}
                      type="button"
                      aria-label="Show services menu"
                      aria-haspopup="true"
                      aria-expanded={servicesOpen}
                      aria-controls="services-dropdown"
                      onClick={() => setServicesOpen((value) => !value)}
                      onKeyDown={onTriggerKeyDown}
                      className="ml-1.5 grid size-6 place-items-center text-mute transition-colors duration-200 hover:text-bone"
                    >
                      <ChevronDown
                        aria-hidden
                        strokeWidth={1.5}
                        className={cn("size-3 transition-transform duration-[250ms] ease-[var(--ease-out-soft)]", servicesOpen && "rotate-180")}
                      />
                    </button>
                  </div>

                  <div
                    id="services-dropdown"
                    role="group"
                    aria-label="Services menu"
                    inert={!servicesOpen}
                    onKeyDown={onPanelKeyDown}
                    className={cn(
                      "absolute left-1/2 top-full z-10 w-[min(21rem,calc(100vw-2.5rem))] -translate-x-1/2 pt-3 transition-[opacity,transform,visibility] duration-[250ms] ease-[var(--ease-out-soft)]",
                      servicesOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
                    )}
                  >
                    <div className="border border-line bg-ink/95 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-md">
                      <p className="eyebrow px-3 py-2">All services</p>
                      <ul>
                        {services.map((service, i) => (
                          <li key={service.slug}>
                            <Link
                              ref={i === 0 ? firstServiceLink : undefined}
                              href={`/services/${service.slug}`}
                              onClick={() => setServicesOpen(false)}
                              className="group flex items-center justify-between gap-3 px-3 py-2 text-[0.7rem] uppercase tracking-[0.14em] text-bone/80 transition-colors duration-200 hover:bg-surface hover:text-bone"
                            >
                              {service.name}
                              <ArrowUpRight
                                aria-hidden
                                strokeWidth={1.5}
                                className="size-3.5 text-mute transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone"
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/services"
                        onClick={() => setServicesOpen(false)}
                        className="mt-1 flex items-center justify-between border-t border-line px-3 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-bone transition-colors duration-200 hover:text-mute"
                      >
                        Browse all
                        <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </li>
              ) : (
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
              ),
            )}
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
