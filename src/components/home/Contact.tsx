import { contact } from '@/content/home';
import { site } from '@/content/site';
import { Container } from '@/components/layout/Container';
import { Pill } from '@/components/ui';
import { ContactForm } from './ContactForm';
import { CopyEmail } from './CopyEmail';
import { SectionHeading } from './SectionHeading';

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-8 border-t border-line">
      <Container className="flex flex-col gap-16 py-24 sm:py-36">
        <div className="flex flex-col items-center gap-6 text-center">
          <SectionHeading id="contact-heading" eyebrow={contact.eyebrow} lines={contact.heading} align="center" />
          <p className="max-w-xl text-lead text-fg-muted" data-reveal>
            {contact.body}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3" data-reveal>
            <a href={`mailto:${site.email}`} className="text-heading font-medium break-all text-link hover:text-link-hi">
              {site.email}
            </a>
            <CopyEmail email={site.email} label={contact.copyLabel} copiedLabel={contact.copiedLabel} />
          </div>
          <div className="flex flex-wrap justify-center gap-3" data-reveal>
            <Pill href={site.resume.href} download variant="solid">
              {site.resume.label}
            </Pill>
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                data-press
                className="inline-flex items-center rounded-full border border-line-hi px-5 py-3 text-label font-semibold text-fg-hi hover:bg-surface-2"
              >
                {s.label}
              </a>
            ))}
          </div>
          <p className="text-label text-fg-muted" data-reveal>
            <a href={site.phoneHref} className="font-mono hover:text-fg-hi">
              {site.phone}
            </a>
            <span aria-hidden="true"> · </span>
            {contact.availability}
          </p>
        </div>

        <div className="mx-auto w-full max-w-2xl rounded-card border border-line bg-surface-1 p-5 sm:p-7" data-reveal>
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
