import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/types";
import { cn, pad2 } from "@/lib/utils";

type Props = {
  service: Service;
  index: number;
  active?: boolean;
  onActivate?: () => void;
};

/** Editorial index row: number, name, summary reveal and arrow. */
export function ServiceItem({ service, index, active, onActivate }: Props) {
  return (
    <li data-stagger-item className="border-t border-line last:border-b">
      <Link
        href={`/services/${service.slug}`}
        onMouseEnter={onActivate}
        onFocus={onActivate}
        className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-5 md:grid-cols-[4rem_1fr_auto] md:py-7"
      >
        <span className={cn("eyebrow transition-colors", active && "text-bone")}>{pad2(index + 1)}</span>
        <span className="min-w-0">
          <span className="flex items-center gap-4">
            <span className="relative block size-14 shrink-0 overflow-hidden bg-ink-2 lg:hidden">
              <Image src={service.image} alt="" fill sizes="56px" className="tone object-cover" />
            </span>
            <span
              className={cn(
                "block text-[clamp(1.35rem,3.2vw,2.75rem)] font-light uppercase leading-none tracking-[-0.03em] transition-[color,transform] duration-700 ease-[var(--ease-out-soft)]",
                active ? "text-bone lg:translate-x-3" : "text-bone/55 group-hover:text-bone",
              )}
            >
              {service.name}
            </span>
          </span>
          <span
            className={cn(
              "mt-0 hidden max-w-md overflow-hidden text-sm leading-relaxed text-mute transition-[max-height,opacity,margin] duration-700 ease-[var(--ease-out-soft)] lg:block",
              active ? "mt-3 max-h-20 opacity-100 lg:translate-x-3" : "max-h-0 opacity-0",
            )}
          >
            {service.summary}
          </span>
        </span>
        <ArrowUpRight
          aria-hidden
          strokeWidth={1.25}
          className={cn(
            "size-5 transition-[transform,color] duration-500 ease-[var(--ease-out-soft)] md:size-6",
            active ? "translate-x-0.5 -translate-y-0.5 text-bone" : "text-mute group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
          )}
        />
      </Link>
    </li>
  );
}
