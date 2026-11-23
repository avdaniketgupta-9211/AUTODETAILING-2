"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { mainNav } from "@/data/navigation";
import { business } from "@/data/business";
import { services } from "@/data/services";
import { motionState } from "@/animations/gsap";
import { cn, pad2 } from "@/lib/utils";

type Props = { open: boolean; onClose: () => void; isActive: (href: string) => boolean };

export function MobileMenu({ open, onClose, isActive }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      const id = setTimeout(() => setServicesOpen(false), 0);
      return () => clearTimeout(id);
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    motionState.lenis?.stop();
    const first = panelRef.current?.querySelector<HTMLElement>("a");
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const f = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a, button"));
        const firstEl = f[0];
        const lastEl = f[f.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      motionState.lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "fixed inset-0 z-40 flex flex-col bg-ink pt-24 transition-[clip-path] duration-700 ease-[var(--ease-cine)] lg:hidden",
        open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]",
      )}
    >
      <nav aria-label="Mobile" className="wrap flex-1 overflow-y-auto">
        <ul className="border-t border-line">
          {mainNav.map((item, i) => (
            <li key={item.href} className="border-b border-line">
              <div className="flex items-center justify-between gap-3">
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "flex min-w-0 flex-1 items-baseline gap-5 py-5 transition-[opacity,transform] duration-700",
                    open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                  )}
                  style={{ transitionDelay: open ? `${120 + i * 50}ms` : "0ms" }}
                >
                  <span className="eyebrow w-6 shrink-0">{pad2(i + 1)}</span>
                  <span className="text-[clamp(1.8rem,8vw,2.6rem)] font-light uppercase tracking-[-0.02em]">{item.label}</span>
                </Link>
                {item.href === "/services" && (
                  <button
                    type="button"
                    aria-label={servicesOpen ? "Hide services" : "Show services"}
                    aria-expanded={servicesOpen}
                    aria-controls="mobile-services-list"
                    onClick={() => setServicesOpen((value) => !value)}
                    className="grid size-11 shrink-0 place-items-center text-bone"
                  >
                    <ChevronDown
                      aria-hidden
                      strokeWidth={1.5}
                      className={cn("size-5 transition-transform duration-[250ms] ease-[var(--ease-out-soft)]", servicesOpen && "rotate-180")}
                    />
                  </button>
                )}
              </div>
              {item.href === "/services" && servicesOpen && (
                <ul id="mobile-services-list" className="border-t border-line pb-3">
                  {services.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/services/${service.slug}`}
                        onClick={onClose}
                        className="block break-words py-3 pl-14 pr-5 text-sm text-bone/75 transition-colors duration-200 hover:text-bone"
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="wrap grid gap-2 border-t border-line py-6 text-sm text-mute">
        <a href={business.phoneHref} className="text-bone">{business.phoneDisplay}</a>
        <a href={business.emailHref}>{business.email}</a>
        <span>
          {business.address.street}, {business.address.city}
        </span>
      </div>
    </div>
  );
}
