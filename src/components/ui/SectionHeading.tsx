import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type LinesProps = { lines: ReactNode[]; className?: string; lineClassName?: string };

/** Server-rendered line split: real text in the DOM, animated by the reveal system. */
export function Lines({ lines, lineClassName }: LinesProps) {
  return (
    <>
      {lines.map((l, i) => (
        <span key={i} className={cn("line", lineClassName)}>
          <span>{l}</span>
        </span>
      ))}
    </>
  );
}

type Props = {
  chapter?: string;
  label: string;
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3";
  className?: string;
  size?: "xl" | "lg" | "md";
  id?: string;
};

const sizes = {
  xl: "text-[clamp(2.6rem,9vw,8.5rem)]",
  lg: "text-[clamp(2.2rem,6.4vw,6rem)]",
  md: "text-[clamp(1.9rem,4.4vw,4rem)]",
};

export function SectionHeading({ chapter, label, lines, as: Tag = "h2", className, size = "lg", id }: Props) {
  return (
    <div className={className}>
      <p className="eyebrow mb-8 flex items-center gap-4" data-reveal="fade">
        {chapter && <span className="text-bone">{chapter}</span>}
        <span aria-hidden className="h-px w-10 bg-line" />
        <span>{label}</span>
      </p>
      <Tag id={id} className={cn("display", sizes[size])} data-reveal="lines">
        <Lines lines={lines} />
      </Tag>
    </div>
  );
}
