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

  const arrow =
    'grid size-11 place-items-center rounded-full border border-line-hi text-fg-hi transition-colors hover:border-flame hover:text-flame aria-disabled:opacity-35 aria-disabled:hover:border-line-hi aria-disabled:hover:text-fg-hi';

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Projects" className="flex flex-col gap-6" onKeyDown={onKey}>
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-label text-fg-muted" aria-live="polite">
          <span className="text-fg-hi">{String(index + 1).padStart(2, '0')}</span> / {String(items.length).padStart(2, '0')}
          <span className="sr-only">: {items[index].name}</span>
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={prev} aria-disabled={atStart || undefined} aria-label="Previous project" data-press className={arrow}>
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 3.5 5.5 8l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" onClick={next} aria-disabled={atEnd || undefined} aria-label="Next project" data-press className={arrow}>
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 3.5 10.5 8 6 12.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={track}
        className="project-track -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto overscroll-x-contain px-4 pb-2 sm:-mx-8 sm:scroll-px-8 sm:gap-5 sm:px-8 lg:mr-[calc(50%-50vw)]"
      >
        {children.map((child, i) => (
          <div
            key={items[i].slug}
            id={`slide-${items[i].slug}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}: ${items[i].name}`}
            className="flex w-[86%] shrink-0 snap-start sm:w-[58%] lg:w-[38%] [&>*]:w-full"
          >
            {child}
          </div>
        ))}
      </div>

      <div className="project-dots flex justify-center gap-1">
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
  );
}
