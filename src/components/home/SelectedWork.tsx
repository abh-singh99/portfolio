import Link from 'next/link';
import { work } from '@/content/home';
import { projects } from '@/content/projects';
import { Section } from './Section';

export function SelectedWork() {
  return (
    <Section id="work" heading={work.heading} intro={work.intro}>
      <ol className="border-b border-line">
        {projects.map((p) => (
          <li key={p.slug} data-reveal>
            {/* The title link stretches over the row; the row answers with a
                ground change, never a scale, since it is a composite target. */}
            <article className="group relative grid gap-4 border-t border-line py-8 transition-colors hover:bg-surface-1 focus-within:bg-surface-1 sm:grid-cols-[5rem_1fr] sm:gap-6 sm:px-4">
              <p className="font-mono text-label text-fg-muted">{p.id}</p>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <h3 className="font-display text-title font-semibold text-fg-hi">
                    <Link
                      href={`/work/${p.slug}`}
                      className="after:absolute after:inset-0 after:rounded focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-solid focus-visible:after:outline-focus"
                    >
                      {p.name}
                    </Link>
                  </h3>
                  <p className="text-body text-fg-muted">
                    {p.summary} · {p.platforms.join(', ')}
                  </p>
                </div>

                <dl className="grid gap-4 text-body-sm md:grid-cols-3">
                  <div className="flex flex-col gap-1">
                    <dt className="text-label font-medium text-fg-hi">Problem</dt>
                    <dd className="text-fg-muted">{p.problem}</dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-label font-medium text-fg-hi">What I did</dt>
                    <dd className="text-fg-muted">{p.contribution}</dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-label font-medium text-fg-hi">Outcome</dt>
                    <dd className="text-fg-muted">{p.outcome}</dd>
                  </div>
                </dl>

                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="flex items-baseline gap-2">
                    <span className="font-mono text-heading font-medium text-fg-hi tabular-nums">{p.metric.value}</span>
                    <span className="text-label text-fg-muted">{p.metric.label}</span>
                  </p>
                  <span aria-hidden="true" className="text-label font-medium text-link group-hover:text-link-hi">
                    {work.caseStudyLabel} →
                  </span>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}
