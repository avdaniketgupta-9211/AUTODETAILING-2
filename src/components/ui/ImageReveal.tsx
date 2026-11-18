import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  parallax?: number;
  tone?: "tone" | "tone-deep" | "none";
  caption?: string;
};

/** Image with clip-path reveal and optional restrained parallax (desktop only). */
export function ImageReveal({
  src,
  alt,
  className,
  imgClassName,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  parallax,
  tone = "tone",
  caption,
}: Props) {
  return (
    <figure className={cn("relative", className)}>
      <div className="relative h-full w-full overflow-hidden bg-ink-2" data-reveal="clip">
        <div
          className={parallax ? "absolute inset-x-0 -inset-y-[8%]" : "absolute inset-0"}
          {...(parallax ? { "data-parallax": String(parallax) } : {})}
        >
          <div className="absolute inset-0" data-parallax-target>
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              priority={priority}
              className={cn("object-cover", tone !== "none" && tone, imgClassName)}
            />
          </div>
        </div>
      </div>
      {caption && (
        <figcaption className="eyebrow mt-4 flex items-center gap-3">
          <span aria-hidden className="h-px w-6 bg-line" />
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
