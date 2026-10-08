'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/content/site';
import { ThemeToggle } from './ThemeToggle';

// Tracks which home section is in view so the nav can mark it.
function useActiveSection(ids: string[], enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return setActive(null);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids, enabled]);
  return active;
}

const sectionIds = site.nav.map((n) => n.href.split('#')[1]);

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = useActiveSection(sectionIds, pathname === '/');

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="pointer-events-auto flex items-center justify-between border-b border-line bg-surface-0 px-4 py-3 sm:pointer-events-none sm:items-start sm:border-0 sm:bg-transparent sm:px-8 sm:pt-7 sm:pb-0">
        <Link
          href="/"
          className="pointer-events-auto rounded text-heading font-semibold tracking-tight text-fg-hi"
        >
          {site.shortName}
          <span className="text-flame">.</span>
        </Link>

        <nav aria-label="Primary" className="pointer-events-auto hidden flex-col items-end sm:flex">
          {site.nav.map((item) => {
            const id = item.href.split('#')[1];
            const isActive = active === id;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'true' : undefined}
                className="flex min-h-6 items-center gap-2 rounded px-1 py-1 text-label font-medium uppercase tracking-wide text-fg-hi hover:text-flame"
              >
                <span
                  aria-hidden="true"
                  className={`size-1.5 rounded-full bg-current transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}
                />
                {item.label}
              </Link>
            );
          })}
          <div className="mt-2 flex items-center gap-1">
            <a
              href={site.resume.href}
              download
              className="inline-flex min-h-6 items-center rounded px-1 py-1 text-label font-medium uppercase tracking-wide text-link hover:text-link-hi"
            >
              CV
            </a>
            <ThemeToggle />
          </div>
        </nav>

        <div className="pointer-events-auto flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            data-press
            className="rounded-full border border-line-hi bg-surface-0 px-4 py-2 text-label font-medium uppercase tracking-wide text-fg-hi"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="pointer-events-auto mx-4 mt-3 flex flex-col rounded-card border border-line bg-surface-1 p-2 sm:hidden"
        >
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded px-3 py-3 text-heading font-semibold text-fg-hi hover:bg-surface-2"
            >
              {item.label}
            </Link>
          ))}
          <a href={site.resume.href} download className="rounded px-3 py-3 text-body font-medium text-link">
            {site.resume.label}
          </a>
        </nav>
      )}
    </header>
  );
}
