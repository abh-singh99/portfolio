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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  // Transparent over the hero; once the page scrolls it turns into a frosted
  // bar so the glow still shows through but text underneath never clashes.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        data-scrolled={scrolled || undefined}
        className={`border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled
            ? 'border-line bg-surface-0/70 backdrop-blur-xl backdrop-saturate-150'
            : 'border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-8 sm:py-4">
        <Link href="/" className="rounded text-heading font-semibold tracking-tight text-fg-hi">
          {site.shortName}
          <span className="text-flame">.</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
          {site.nav.map((item) => {
            const id = item.href.split('#')[1];
            const isActive = active === id;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'true' : undefined}
                className={`relative rounded px-3 py-2 text-label font-medium transition-colors hover:text-fg-hi ${isActive ? 'text-fg-hi' : 'text-fg-muted'}`}
              >
                {item.label}
                <span aria-hidden="true" className="nav-underline absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-flame" />
              </Link>
            );
          })}
          <span aria-hidden="true" className="mx-2 h-5 w-px bg-line-hi/40" />
          <a
            href={site.resume.href}
            download
            className="glow-cta inline-flex min-h-9 items-center rounded-full border border-line-hi px-4 text-label font-semibold text-fg-hi hover:border-flame"
          >
            CV
          </a>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-1 sm:hidden">
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
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="glass mx-4 mt-3 flex flex-col rounded-card p-2 sm:hidden"
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
