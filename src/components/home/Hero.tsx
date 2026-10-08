import Link from 'next/link';
import { hero } from '@/content/home';
import { site } from '@/content/site';
import { Container } from '@/components/layout/Container';

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="pt-16 pb-20 sm:pt-28 sm:pb-28">
      <Container className="flex flex-col gap-10">
        <p className="flex items-center gap-2 text-label font-medium text-fg-muted" data-reveal>
          <span aria-hidden="true" className="size-2 rounded-full bg-success" />
          {hero.availability}
          <span aria-hidden="true">·</span>
          {site.role}, {site.location}
        </p>

        <h1 id="hero-heading" className="font-display text-hero font-semibold text-fg-hi" data-reveal>
          {hero.title.map((line, i) => (
            <span key={line} className={`block ${i === hero.accentLine ? 'text-flame' : ''}`}>
              {line}
            </span>
          ))}
        </h1>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-end" data-reveal data-reveal-delay="0.1">
          <p className="max-w-xl text-subheading text-fg lg:col-span-7">{hero.intro}</p>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <Link
              href="/#work"
              data-press
              className="rounded bg-accent px-5 py-3 text-label font-medium text-accent-on hover:bg-accent-hi"
            >
              See selected work
            </Link>
            <a
              href={site.resume.href}
              download
              data-press
              className="rounded border border-line-hi px-5 py-3 text-label font-medium text-fg-hi hover:bg-surface-2"
            >
              {site.resume.label}
            </a>
          </div>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6 font-mono text-label text-fg-muted" data-reveal data-reveal-delay="0.2">
          {hero.proof.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
