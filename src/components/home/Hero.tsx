import { hero } from '@/content/home';
import { site } from '@/content/site';
import { Pill } from '@/components/ui';
import { PerspectiveGrid } from '@/components/PerspectiveGrid';
import { Accents } from '@/components/Accents';
import { Container } from '@/components/layout/Container';
import { SocialIcon } from '@/components/SocialIcon';
import { TypedRoles } from './TypedRoles';

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-svh items-center overflow-hidden pt-28 pb-20"
    >
      <PerspectiveGrid />

      {/* Text lets the pointer through to the grid; only links catch it. */}
      <Container className="pointer-events-none relative z-10">
        <div className="flex max-w-5xl flex-col items-start gap-5 sm:gap-6 [&_a]:pointer-events-auto">
          <p className="badge-glow glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-label font-medium text-fg">
            <span aria-hidden="true" className="status-dot size-2 rounded-full bg-success" />
            {hero.badge}
          </p>

          <div className="flex flex-col gap-3">
            <p className="text-eyebrow font-semibold uppercase text-flame">{site.name}</p>
            <h1 id="hero-heading" className="hd-mix text-hero text-fg-hi">
              {hero.title.map((line) => (
                <span key={line} className="block">
                  <Accents text={line} />
                </span>
              ))}
            </h1>
          </div>

          <p className="min-h-[1.5em] font-mono text-body text-fg-muted sm:text-subheading">
            <span aria-hidden="true">{hero.rolesLead} </span>
            <TypedRoles roles={hero.roles} label={hero.rolesLabel} />
          </p>

          <p className="max-w-2xl text-lead text-fg-muted">{hero.intro}</p>

          <ul aria-label="Main tools" className="flex flex-wrap gap-2">
            {hero.chips.map((c) => (
              <li key={c} className="glass rounded-full px-3.5 py-1.5 text-label text-fg">
                {c}
              </li>
            ))}
          </ul>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Pill href="/#work" variant="solid" glow>
              {hero.cta.work}
            </Pill>
            <Pill href={site.resume.href} download>
              {site.resume.label}
            </Pill>
            <Pill href="/#contact">{hero.cta.contact}</Pill>
            <span aria-hidden="true" className="mx-1 hidden h-8 w-px bg-line-hi/40 sm:block" />
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
                  className="glass glass-hover grid size-11 place-items-center rounded-card text-fg-hi"
                >
                  <SocialIcon name={s.label} />
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${site.email}`}
                aria-label="Email"
                title="Email"
                data-press
                className="glass glass-hover grid size-11 place-items-center rounded-card text-fg-hi"
              >
                <SocialIcon name="Email" />
              </a>
            </li>
          </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
