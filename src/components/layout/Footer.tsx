import { site } from '@/content/site';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-3 py-8 text-caption text-fg-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. This site is tested with Playwright on every push.
        </p>
        <ul className="flex gap-4">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-fg-hi">
                {s.label}
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${site.email}`} className="hover:text-fg-hi">
              Email
            </a>
          </li>
        </ul>
      </Container>
    </footer>
  );
}
