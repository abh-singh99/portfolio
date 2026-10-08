import Link from 'next/link';
import { site } from '@/content/site';
import { PerspectiveGrid } from '@/components/PerspectiveGrid';
import { Container } from './Container';

export function Footer() {
  const link = 'pointer-events-auto rounded hover:text-fg-hi';
  return (
    <footer className="relative isolate overflow-hidden border-t border-line">
      <PerspectiveGrid />

      {/* Text lets the pointer through to the grid; only links catch it. */}
      <Container className="pointer-events-none relative z-10 flex min-h-96 flex-col justify-between gap-16 pt-20 pb-8">
        <div className="flex flex-col items-center gap-8 text-center">
          <p className="font-display text-hero font-semibold text-fg-hi">
            {site.shortName}
            <span className="text-flame">.</span>
          </p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-label font-medium uppercase tracking-wide text-fg">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`${link} hover:text-flame`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-line pt-6 text-caption text-fg-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. This site is tested with Playwright on every push.
          </p>
          <ul className="flex gap-4">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className={link}>
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`} className={link}>
                Email
              </a>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
