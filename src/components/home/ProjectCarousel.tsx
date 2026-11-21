'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Item = { slug: string; name: string; metric: string; tag: string };

// One project at a time instead of a long stack. Slides sit side by side in a
// scroll-snap track, so touch swipe and trackpad scroll work natively; the
// tabs, arrows and arrow keys move it in code. Every slide stays in the DOM,
// so all projects remain readable to search engines and screen readers.
export function ProjectCarousel({ items, children }: { items: Item[]; children: React.ReactNode[] }) {
  const track = useRef<HTMLDivElement>(null);
  const picker = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  // Slide a tab/arrow/key is heading to. While set, slides passed on the way
  // are ignored, so a fast second click counts from the target, not from a
  // slide the smooth scroll happens to be crossing.
  const target = useRef<number | null>(null);
  const release = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Follow the slide that is most in view, whatever moved it.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || e.intersectionRatio <= 0.6) continue;
          const i = Number((e.target as HTMLElement).dataset.index);
          if (target.current !== null) {
            if (i === target.current) target.current = null;
            continue;
          }
          setIndex(i);
        }
      },
      { root: el, threshold: [0.6] },
    );
    el.querySelectorAll<HTMLElement>('[data-index]').forEach((s) => io.observe(s));
    return () => {
      io.disconnect();
      clearTimeout(release.current);
    };
  }, []);

  // On phones the tabs scroll sideways; keep the current one in view without
  // moving the page vertically.
  useEffect(() => {
    const row = picker.current;
    const btn = row?.children[index] as HTMLElement | undefined;
    if (!row || !btn || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: btn.offsetLeft - row.offsetLeft - 16, behavior: 'smooth' });
  }, [index]);

  const go = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const next = (i + items.length) % items.length;
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.current = next;
      clearTimeout(release.current);
      release.current = setTimeout(() => (target.current = null), 1200);
      el.scrollTo({ left: next * el.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
      setIndex(next);
    },
    [items.length],
  );

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(index - 1);
    }
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Projects" className="flex flex-col gap-6" onKeyDown={onKey}>
      {/* Catalogue: every project and its headline number, visible at once. */}
      <div ref={picker} className="project-picker -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0">
        {items.map((it, i) => {
          const on = i === index;
          return (
            <button
              key={it.slug}
              type="button"
              aria-controls={`slide-${it.slug}`}
              aria-current={on ? 'true' : undefined}
              onClick={() => go(i)}
              className={`group flex min-w-44 shrink-0 snap-start flex-col items-start gap-1 rounded-card border px-4 py-3 text-left transition-colors sm:min-w-0 ${
                on ? 'border-flame bg-surface-1' : 'border-line hover:border-line-hi hover:bg-surface-1'
              }`}
            >
              <span className="font-mono text-caption text-fg-muted">{String(i + 1).padStart(2, '0')}</span>
              <span className={`text-body font-semibold ${on ? 'text-fg-hi' : 'text-fg'}`}>{it.name}</span>
              <span className="font-mono text-label text-flame tabular-nums">{it.metric}</span>
              <span aria-hidden="true" className="relative mt-2 h-0.5 w-full overflow-hidden rounded-full bg-line">
                <span className={`absolute inset-y-0 left-0 bg-flame transition-[width] duration-500 ${on ? 'w-full' : 'w-0'}`} />
              </span>
            </button>
          );
        })}
      </div>

      <div
        ref={track}
        className="project-track flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
      >
        {children.map((child, i) => (
          <div
            key={items[i].slug}
            id={`slide-${items[i].slug}`}
            data-index={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}: ${items[i].name}`}
            className="flex w-full shrink-0 snap-start snap-always [&>*]:w-full"
          >
            {child}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-label text-fg-muted" aria-live="polite">
          <span className="text-fg-hi">{String(index + 1).padStart(2, '0')}</span> / {String(items.length).padStart(2, '0')}
          <span className="sr-only">: {items[index].name}</span>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous project"
            data-press
            className="grid size-11 place-items-center rounded-full border border-line-hi text-fg-hi hover:border-flame hover:text-flame"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 3.5 5.5 8l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next project"
            data-press
            className="grid size-11 place-items-center rounded-full border border-line-hi text-fg-hi hover:border-flame hover:text-flame"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 3.5 10.5 8 6 12.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
