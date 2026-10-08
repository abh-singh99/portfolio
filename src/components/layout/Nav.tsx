'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/content/site';
import { Container } from './Container';
import { ThemeToggle } from './ThemeToggle';

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface-0">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="font-display text-subheading font-semibold text-fg-hi">
          {site.name}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-3 py-2 text-label font-medium text-fg-muted hover:text-fg-hi"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={site.resume.href}
            download
            className="ml-2 rounded px-3 py-2 text-label font-medium text-link hover:text-link-hi"
          >
            {site.resume.label}
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
            className="rounded px-3 py-2 text-label font-medium text-fg hover:bg-surface-2"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </Container>

      {open && (
        <nav id="mobile-nav" aria-label="Primary" className="border-t border-line sm:hidden">
          <Container className="flex flex-col py-2">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-body font-medium text-fg hover:text-fg-hi"
              >
                {item.label}
              </Link>
            ))}
            <a href={site.resume.href} download className="py-3 text-body font-medium text-link">
              {site.resume.label}
            </a>
          </Container>
        </nav>
      )}
    </header>
  );
}
