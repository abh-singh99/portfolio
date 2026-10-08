'use client';

import { useEffect, useRef, useState } from 'react';
import type { ProjectMedia } from '@/content/projects';

// Plays muted on loop only while on screen. Under reduced motion it never
// autoplays: the poster shows with native controls so playback is a choice.
export function ProjectVideo({ media }: { media: ProjectMedia }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduced(isReduced);
    if (isReduced) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  const video = (
    <video
      ref={ref}
      src={media.src}
      poster={media.poster}
      muted
      loop
      playsInline
      preload="metadata"
      controls={reduced}
      aria-label={media.caption}
      className="block h-auto w-full"
    />
  );

  if (media.frame === 'phone') {
    return (
      <figure className="mx-auto w-full max-w-xs" data-reveal>
        <div className="overflow-hidden rounded-phone border-8 border-surface-3 bg-surface-1">{video}</div>
        <figcaption className="sr-only">{media.caption}</figcaption>
      </figure>
    );
  }

  return (
    <figure className="w-full overflow-hidden rounded-card border border-line bg-surface-1" data-reveal>
      <div className="flex items-center gap-2 border-b border-line px-4 py-3" aria-hidden="true">
        <span className="size-2.5 rounded-full bg-surface-3" />
        <span className="size-2.5 rounded-full bg-surface-3" />
        <span className="size-2.5 rounded-full bg-surface-3" />
      </div>
      {video}
      <figcaption className="sr-only">{media.caption}</figcaption>
    </figure>
  );
}
