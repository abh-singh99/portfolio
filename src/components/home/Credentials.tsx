import { credentials } from '@/content/home';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from './SectionHeading';

export function Credentials() {
  const rows = [...credentials.items, credentials.education];
  return (
    <section id="credentials" aria-labelledby="credentials-heading" className="border-t border-line">
      <Container className="grid gap-12 py-24 sm:py-36 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <SectionHeading id="credentials-heading" eyebrow={credentials.eyebrow} lines={credentials.heading} size="section" />
        </div>
        <ul className="flex flex-col lg:col-span-7">
          {rows.map((c) => (
            <li key={c.name} className="flex flex-col gap-1 border-t border-line py-5 last:border-b" data-reveal>
              <p className="text-subheading font-medium text-fg-hi">{c.name}</p>
              <p className="text-label text-fg-muted">{c.issuer}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
