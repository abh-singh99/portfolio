import { credentials } from '@/content/home';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from './SectionHeading';

export function Credentials() {
  const rows = [...credentials.items, credentials.education];
  return (
    <section id="credentials" aria-labelledby="credentials-heading" className="border-t border-line">
      <Container className="flex flex-col gap-16 py-24 sm:py-36">
        <SectionHeading id="credentials-heading" eyebrow={credentials.eyebrow} lines={credentials.heading} size="section" />
        <ul className="mx-auto grid w-full max-w-4xl gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
          {rows.map((c, i) => (
            <li
              key={c.name}
              className={`flex flex-col items-center gap-1 bg-surface-0 px-6 py-8 text-center ${i === rows.length - 1 && rows.length % 2 ? 'sm:col-span-2' : ''}`}
              data-reveal
            >
              <p className="text-subheading font-medium text-fg-hi">{c.name}</p>
              <p className="text-label text-fg-muted">{c.issuer}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
