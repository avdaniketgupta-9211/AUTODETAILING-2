"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type Source = { src: string; minWidth: number };

type Props = {
  sources: Source[]; // ordered largest → smallest
  poster: string;
  posterAlt: string;
  className?: string;
  priority?: boolean;
  showControl?: boolean;
  lazy?: boolean;
};

/**
 * Poster-first background video. The poster (Next/Image) is the LCP element;
 * the best-fit MP4 rendition is chosen client-side for the viewport, then
 * crossfades in once playable. Reduced-motion users keep the still poster.
 */
export const VideoBackground = forwardRef<HTMLDivElement, Props>(function VideoBackground(
  { sources, poster, posterAlt, className, priority, showControl = true, lazy = false },
  ref,
) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);

  useImperativeHandle(ref, () => wrapRef.current as HTMLDivElement);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reduced || conn?.saveData) {
      setPaused(true);
      return;
    }
    const pick = () => {
      const w = window.innerWidth * Math.min(window.devicePixelRatio || 1, 1.5);
      const chosen = sources.find((s) => w >= s.minWidth) ?? sources[sources.length - 1];
      setSrc(chosen.src);
    };
    if (!lazy) {
      pick();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          pick();
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    if (wrapRef.current) io.observe(wrapRef.current);
    return () => io.disconnect();
  }, [sources, lazy]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) {
      if (paused && !src) {
        setSrc(sources[sources.length - 1].src);
        setPaused(false);
      }
      return;
    }
    if (v.paused) {
      void v.play();
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  return (
    <div ref={wrapRef} className={cn("absolute inset-0 overflow-hidden", className)}>
      <Image src={poster} alt={posterAlt} fill priority={priority} sizes="100vw" className="object-cover tone-deep" />
      {src && (
        <video
          ref={videoRef}
          key={src}
          className={cn(
            "absolute inset-0 h-full w-full object-cover tone-deep transition-opacity duration-[1600ms]",
            ready ? "opacity-100" : "opacity-0",
          )}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
        />
      )}
      {showControl && (
        <button
          type="button"
          onClick={toggle}
          className="absolute bottom-6 right-[var(--gutter)] z-20 grid size-11 place-items-center rounded-full border border-line text-bone/80 transition-colors hover:border-bone hover:text-bone"
          aria-label={paused ? "Play background video" : "Pause background video"}
        >
          {paused ? <Play className="size-3.5" strokeWidth={1.5} /> : <Pause className="size-3.5" strokeWidth={1.5} />}
        </button>
      )}
    </div>
  );
});
