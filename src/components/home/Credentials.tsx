import { credentials } from '@/content/home';
import { Section } from './Section';

export function Credentials() {
  const rows = [...credentials.items, credentials.education];
  return (
    <Section id="credentials" heading={credentials.heading}>
      <ul className="grid gap-x-8 sm:grid-cols-2">
        {rows.map((c) => (
          <li key={c.name} className="flex flex-col gap-1 border-t border-line py-4" data-reveal>
            <p className="text-body font-medium text-fg-hi">{c.name}</p>
            <p className="text-label text-fg-muted">{c.issuer}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
