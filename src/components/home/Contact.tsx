import { contact } from '@/content/home';
import { site } from '@/content/site';
import { Container } from '@/components/layout/Container';
import { Pill } from '@/components/ui';
import { ContactForm } from './ContactForm';
import { CopyEmail } from './CopyEmail';
import { SectionHeading } from './SectionHeading';

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-16 border-t border-line">
      <Container className="grid gap-16 py-24 sm:py-36 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-8 lg:col-span-6">
          <SectionHeading
            id="contact-heading"
            eyebrow={contact.eyebrow}
            lines={contact.heading}
            size="section"
            align="left"
          />
          <p className="max-w-md text-lead text-fg-muted" data-reveal>
            {contact.body}
          </p>

          <dl className="flex flex-col border-t border-line" data-reveal>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-4">
              <dt className="text-label text-fg-muted">{contact.details.email}</dt>
              <dd className="flex flex-wrap items-center gap-3">
                <a href={`mailto:${site.email}`} className="text-body font-medium break-all text-link hover:text-link-hi">
                  {site.email}
                </a>
                <CopyEmail email={site.email} label={contact.copyLabel} copiedLabel={contact.copiedLabel} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-line py-4">
              <dt className="text-label text-fg-muted">{contact.details.phone}</dt>
              <dd>
                <a href={site.phoneHref} className="text-body text-fg-hi hover:text-link">
                  {site.phone}
                </a>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-line py-4">
              <dt className="text-label text-fg-muted">{contact.details.location}</dt>
              <dd className="text-body text-fg-hi">{site.location}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-3" data-reveal>
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
            {contact.availability}
          </p>
        </div>

        <div className="lg:col-span-6" data-reveal>
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
