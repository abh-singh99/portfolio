import { contact } from '@/content/home';
import { site } from '@/content/site';
import { Container } from '@/components/layout/Container';
import { ContactForm } from './ContactForm';
import { CopyEmail } from './CopyEmail';

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-16 py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-8 lg:col-span-6" data-reveal>
          <div className="flex flex-col gap-4">
            <h2 id="contact-heading" className="font-display text-statement font-semibold text-fg-hi text-balance">
              {contact.heading}
            </h2>
            <p className="max-w-md text-subheading text-fg">{contact.body}</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <a href={`mailto:${site.email}`} className="text-heading font-medium text-link hover:text-link-hi break-all">
                {site.email}
              </a>
              <CopyEmail email={site.email} label={contact.copyLabel} copiedLabel={contact.copiedLabel} />
            </div>
            <a href={site.phoneHref} className="font-mono text-body text-fg hover:text-fg-hi">
              {site.phone}
            </a>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-label font-medium">
            <li>
              <a href={site.resume.href} download className="text-link hover:text-link-hi">
                {site.resume.label}
              </a>
            </li>
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="text-link hover:text-link-hi">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>

          <p className="text-label text-fg-muted">{contact.availability}</p>
        </div>

        <div className="rounded-card border border-line bg-surface-1 p-6 sm:p-8 lg:col-span-6" data-reveal data-reveal-delay="0.1">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
