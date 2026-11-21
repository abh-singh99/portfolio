'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Item = { slug: string; name: string };

// A horizontal rail of project cards with the next card peeking in, so it
// reads as "there's more, swipe". Native scroll-snap does touch and trackpad;
// arrows, dots and arrow keys move it one card at a time. Every card stays in
// the DOM, so all projects remain readable to search engines and screen readers.
export function ProjectCarousel({ items, children }: { items: Item[]; children: React.ReactNode[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const step = () => {
    const el = track.current;
    const first = el?.children[0] as HTMLElement | undefined;
    const second = el?.children[1] as HTMLElement | undefined;
    if (!first) return 1;
    return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
  };

  // Derive the current card and the arrow states from the scroll position,
  // whatever moved it (swipe, trackpad, arrows, dots).
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = el.scrollWidth - el.clientWidth;
      setAtStart(el.scrollLeft <= 2);
      setAtEnd(el.scrollLeft >= max - 2);
      // At the very end the last cards can't reach the left edge, so the
      // last card counts as current once the rail is fully scrolled.
      setIndex(el.scrollLeft >= max - 2 ? items.length - 1 : Math.round(el.scrollLeft / step()));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [items.length]);

  const go = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const next = Math.max(0, Math.min(items.length - 1, i));
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollTo({ left: next * step(), behavior: smooth ? 'smooth' : 'auto' });
    },
    [items.length],
  );

  // Fully scrolled, the last cards can't reach the left edge, so the card at
  // the left edge (not the "current" last one) is where Previous steps from.
  const prev = () => {
    const el = track.current;
    if (!el || atStart) return;
    const from = atEnd ? Math.ceil((el.scrollWidth - el.clientWidth) / step()) - 1 : index;
    go(from - 1);
  };
  const next = () => {
    if (!atEnd) go(index + 1);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
  };

  // Streaming-app style: an arrow sits over each edge of the rail on a fade,
  // and shows while the pointer is over the rail (or the arrow has focus).
  // At either end its arrow stays focusable but is marked aria-disabled, so a
  // keyboard user never loses focus. Touch screens swipe instead.
  const edge = (side: 'left' | 'right') =>
    `rail-arrow absolute inset-y-0 z-10 hidden w-[var(--rail-gutter)] min-w-16 items-center opacity-0 transition-opacity duration-300 group-hover/rail:opacity-100 focus-visible:opacity-100 aria-disabled:pointer-events-none aria-disabled:!opacity-0 aria-disabled:focus-visible:!opacity-40 ${
      side === 'left'
        ? 'left-0 justify-start bg-gradient-to-r from-surface-0 via-surface-0/70 to-transparent pl-4 sm:pl-6'
        : 'right-0 justify-end bg-gradient-to-l from-surface-0 via-surface-0/70 to-transparent pr-4 sm:pr-6'
    }`;
  const chevron = (d: string) => (
    <span className="grid size-12 place-items-center rounded-full border border-line-hi bg-surface-0/80 text-fg-hi shadow-lg backdrop-blur transition-[transform,color,border-color] duration-200 group-hover/arrow:scale-110 group-hover/arrow:border-flame group-hover/arrow:text-flame">
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d={d} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Projects" className="flex flex-col gap-6" onKeyDown={onKey}>
      {/* Full bleed: the rail spans the viewport, so cards scroll in from the
          right edge and out past the left edge; the padding and snap padding
          keep the resting card aligned with the content column. */}
      <div className="project-rail group/rail relative">
        <button type="button" onClick={prev} aria-disabled={atStart || undefined} aria-label="Previous project" className={`group/arrow ${edge('left')}`}>
          {chevron('M10 3.5 5.5 8l4.5 4.5')}
        </button>

        <div ref={track} className="project-track flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 sm:gap-5">
          {children.map((child, i) => (
            <div
              key={items[i].slug}
              id={`slide-${items[i].slug}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}: ${items[i].name}`}
              className="flex w-[86vw] shrink-0 snap-start sm:w-[58vw] lg:w-[min(34rem,38vw)] [&>*]:w-full"
            >
              {child}
            </div>
          ))}
        </div>

        <button type="button" onClick={next} aria-disabled={atEnd || undefined} aria-label="Next project" className={`group/arrow ${edge('right')}`}>
          {chevron('M6 3.5 10.5 8 6 12.5')}
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-label text-fg-muted" aria-live="polite">
          <span className="text-fg-hi">{String(index + 1).padStart(2, '0')}</span> / {String(items.length).padStart(2, '0')}
          <span className="sr-only">: {items[index].name}</span>
        </p>
      <div className="project-dots flex gap-1">
        {items.map((it, i) => (
          <button
            key={it.slug}
            type="button"
            onClick={() => go(i)}
            aria-label={`Go to ${it.name}`}
            aria-controls={`slide-${it.slug}`}
            aria-current={i === index ? 'true' : undefined}
            className="grid h-6 min-w-6 place-items-center"
          >
            <span
              aria-hidden="true"
              className={`block h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-flame' : 'w-1.5 bg-line-hi'}`}
            />
          </button>
        ))}
      </div>
      </div>
    </div>
  );
}
