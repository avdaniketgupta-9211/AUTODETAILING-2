import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "text";
  icon?: "arrow" | "external" | "phone" | "none";
  className?: string;
  ariaLabel?: string;
};

const base =
  "group relative inline-flex items-center gap-3 overflow-hidden text-[0.72rem] font-semibold uppercase tracking-[0.22em] transition-colors duration-500 ease-[var(--ease-out-soft)] min-h-12";

const variants = {
  solid: "bg-bone text-ink px-7 py-4 hover:text-bone",
  outline: "border border-line text-bone px-7 py-4 hover:text-ink hover:border-bone",
  text: "text-bone py-2",
};

export function Button({ href, children, variant = "solid", icon = "arrow", className, ariaLabel }: Props) {
  const external = /^https?:\/\//.test(href);
  const isProtocol = /^(tel|mailto):/.test(href);
  const Icon = icon === "external" ? ArrowUpRight : icon === "phone" ? Phone : ArrowRight;

  const inner = (
    <>
      {variant !== "text" && (
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 -z-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[var(--ease-cine)] group-hover:scale-y-100",
            variant === "solid" ? "bg-ink-2" : "bg-bone",
          )}
        />
      )}
      <span className={cn("relative z-10", variant === "text" && "u-link pb-1")}>{children}</span>
      {icon !== "none" && (
        <Icon
          aria-hidden
          strokeWidth={1.5}
          className="relative z-10 size-4 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:translate-x-1"
        />
      )}
    </>
  );

  const cls = cn(base, variants[variant], className);

  if (external || isProtocol) {
    return (
      <a
        href={href}
        className={cls}
        aria-label={ariaLabel}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {inner}
    </Link>
  );
}
