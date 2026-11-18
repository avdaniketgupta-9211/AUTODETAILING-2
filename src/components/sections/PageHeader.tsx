import Image from "next/image";
import type { ReactNode } from "react";
import { Lines } from "@/components/ui/SectionHeading";

type Props = {
  label: string;
  lines: ReactNode[];
  intro: string;
  image: string;
  imageAlt: string;
  children?: ReactNode;
};

/** Cinematic header for secondary pages — real <h1>, still image, line reveal. */
export function PageHeader({ label, lines, intro, image, imageAlt, children }: Props) {
  return (
    <section className="grain relative flex min-h-[78svh] items-end overflow-hidden bg-ink">
      <div className="absolute inset-0" data-parallax="10">
        <div className="absolute -inset-y-[6%] inset-x-0" data-parallax-target>
          <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="tone-deep object-cover" />
        </div>
      </div>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,17,18,0.7)_0%,rgba(16,17,18,0.25)_40%,rgba(16,17,18,0.97)_100%)]" />
      <div className="wrap relative z-10 pb-16 pt-36 md:pb-24">
        <p className="eyebrow mb-8 flex items-center gap-4 text-bone/80" data-reveal="fade">
          <span aria-hidden className="h-px w-10 bg-bone/50" />
          {label}
        </p>
        <h1 className="display max-w-[16ch] text-[clamp(2.6rem,8vw,8rem)]" data-reveal="lines">
          <Lines lines={lines} />
        </h1>
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-lg text-[1rem] leading-relaxed text-bone/80 md:text-lg" data-reveal="fade">
            {intro}
          </p>
          {children && <div data-reveal="fade">{children}</div>}
        </div>
      </div>
    </section>
  );
}
