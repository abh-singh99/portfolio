import { contact } from '@/content/home';
import { site } from '@/content/site';
import { Container } from '@/components/layout/Container';
import { Pill } from '@/components/ui';
import { PerspectiveGrid } from '@/components/PerspectiveGrid';
import { CopyEmail } from './CopyEmail';
import { SectionHeading } from './SectionHeading';

// The closing screen: one centred call to action over the grid.
export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative isolate flex min-h-svh scroll-mt-16 items-center justify-center overflow-hidden border-t border-line"
    >
      <PerspectiveGrid />

      {/* The pointer passes through to the grid except over links and buttons. */}
      <Container className="pointer-events-none relative z-10 flex flex-col items-center gap-8 py-32 text-center [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        <SectionHeading id="contact-heading" eyebrow={contact.eyebrow} lines={contact.heading} />
        <p className="max-w-xl text-lead text-fg-muted" data-reveal>
          {contact.body}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4" data-reveal>
          <a
            href={`mailto:${site.email}`}
            className="rounded font-display text-heading font-medium text-fg-hi hover:text-flame sm:text-title"
          >
            {site.email}
          </a>
          <CopyEmail email={site.email} label={contact.copyLabel} copiedLabel={contact.copiedLabel} />
        </div>

        <div className="mt-4 flex flex-col items-center gap-4" data-reveal>
          <div className="flex flex-wrap justify-center gap-3">
            <Pill href={`mailto:${site.email}`} variant="solid">
              {contact.emailCta}
            </Pill>
            <Pill href={site.resume.href} download>
              {site.resume.label}
            </Pill>
          </div>
          <ul className="flex gap-3">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  data-press
                  className="grid size-11 place-items-center rounded-full border border-line-hi text-label font-semibold text-fg-hi hover:bg-surface-2"
                >
                  {s.short}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
