import { work } from '@/content/home';
import { projects, type Project } from '@/content/projects';
import { Container } from '@/components/layout/Container';
import { Pill, Tag } from '@/components/ui';
import { SectionHeading } from './SectionHeading';

// Stands in for a product screenshot: the suite's real numbers, laid out like
// a test run summary. Nothing here is invented; it reads from projects.ts.
function TestSummary({ p }: { p: Project }) {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface-1 text-left" data-reveal>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-8">
        <p className="font-mono text-label text-fg-muted">
          {p.id} · {work.summaryLabel}
        </p>
        <p className="font-mono text-label text-fg-muted">{p.platforms.join(' / ')}</p>
      </div>
      <div className="grid gap-10 p-5 sm:p-8 lg:grid-cols-5 lg:gap-12">
        <div className="flex flex-col justify-end gap-2 lg:col-span-2">
          <p className="font-mono text-section font-medium whitespace-nowrap text-flame tabular-nums">{p.metric.value}</p>
          <p className="text-body text-fg-muted">{p.metric.label}</p>
        </div>
        <dl className="flex flex-col lg:col-span-3">
          {p.strategy.map((s) => (
            <div key={s.label} className="grid gap-1 border-b border-line py-3 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <dt className="text-label text-fg-muted">{s.label}</dt>
              <dd className="text-body text-fg-hi">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function ProjectBlock({ p }: { p: Project }) {
  return (
    <article aria-labelledby={`${p.slug}-title`} className="border-t border-line py-24 sm:py-32">
      <Container className="flex flex-col gap-12">
        <header className="flex flex-col items-center gap-5 text-center" data-reveal>
          <p className="text-eyebrow font-semibold uppercase text-fg-muted">
            {p.id.replace('TC-', '')} / {p.category} · {p.platforms.join(', ')}
          </p>
          <h3 id={`${p.slug}-title`} className="font-display text-statement font-medium text-fg-hi">
            {p.name}
          </h3>
          <p className="max-w-xl text-lead text-fg-muted">{p.summary}.</p>
          <ul className="flex flex-wrap justify-center gap-2">
            {p.tools.map((t) => (
              <li key={t}>
                <Tag>{t}</Tag>
              </li>
            ))}
          </ul>
        </header>

        <TestSummary p={p} />

        <dl className="mx-auto grid w-full max-w-4xl gap-x-16 gap-y-10 md:grid-cols-2" data-reveal>
          <div className="flex flex-col gap-3">
            <dt className="text-title font-semibold text-fg-hi">The problem</dt>
            <dd className="text-body text-fg-muted">{p.problem}</dd>
          </div>
          <div className="flex flex-col gap-3">
            <dt className="text-title font-semibold text-fg-hi">My contribution</dt>
            <dd className="text-body text-fg-muted">{p.contribution}</dd>
          </div>
          <div className="flex flex-col gap-3 md:col-span-2">
            <dt className="text-title font-semibold text-fg-hi">The outcome</dt>
            <dd className="text-body text-fg-muted">{p.outcome}</dd>
          </div>
        </dl>

        <div className="flex justify-center" data-reveal>
          <Pill href={`/work/${p.slug}`} variant="solid" arrow ariaLabel={`${work.caseStudyLabel}: ${p.name}`}>
            {work.caseStudyLabel}
          </Pill>
        </div>
      </Container>
    </article>
  );
}

export function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-heading" className="scroll-mt-8">
      <Container className="py-24 sm:py-36">
        <SectionHeading id="work-heading" eyebrow={work.eyebrow} lines={work.heading} align="center" />
      </Container>
      {projects.map((p) => (
        <ProjectBlock key={p.slug} p={p} />
      ))}
    </section>
  );
}
