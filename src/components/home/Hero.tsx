import { hero } from '@/content/home';
import { site } from '@/content/site';
import { Eyebrow, Pill } from '@/components/ui';
import { PerspectiveGrid } from '@/components/PerspectiveGrid';

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-svh items-center justify-center overflow-hidden px-4 pt-28 pb-20"
    >
      <PerspectiveGrid />

      {/* Text lets the pointer through to the grid; only the buttons catch it. */}
      <div className="pointer-events-none relative z-10 flex max-w-5xl flex-col items-center gap-6 text-center">
        <Eyebrow>{hero.eyebrow}</Eyebrow>
        <h1 id="hero-heading" className="font-display text-hero font-semibold text-fg-hi" data-reveal>
          {hero.title.map((line, i) => (
            <span key={line} className={`block ${i === hero.accentLine ? 'text-flame' : ''}`}>
              {line}
            </span>
          ))}
        </h1>
        <p className="max-w-2xl text-lead text-fg-muted" data-reveal data-reveal-delay="0.1">
          {hero.intro}
        </p>
        <p className="text-body text-fg" data-reveal data-reveal-delay="0.15">
          <span aria-hidden="true" className="mr-2 inline-block size-2 rounded-full bg-success align-middle" />
          {hero.location}
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3" data-reveal data-reveal-delay="0.2">
          <Pill href="/#work" variant="solid">
            {hero.cta.work}
          </Pill>
          <Pill href={site.resume.href} download>
            {site.resume.label}
          </Pill>
          <Pill href="/#contact">{hero.cta.contact}</Pill>
        </div>
      </div>
    </section>
  );
}
