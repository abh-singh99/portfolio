import { work } from '@/content/home';
import { projects, type Project } from '@/content/projects';
import { Container } from '@/components/layout/Container';
import { ProjectVideo } from '@/components/ProjectVideo';
import { ProjectStage } from '@/components/ProjectStage';
import { ProjectLink } from '@/components/ProjectLink';
import { SectionHeading } from './SectionHeading';
import { ProjectCarousel } from './ProjectCarousel';

// For projects without screens yet: the test strategy, laid out like a test
// run summary, in the same slot the screens take. Reads only from projects.ts.
function TestSummary({ p }: { p: Project }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface-1">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-7">
        <p className="font-mono text-label text-fg-muted">
          {p.id} · {work.summaryLabel}
        </p>
        <p className="font-mono text-label text-fg-muted">{p.platforms.join(' / ')}</p>
      </div>
      <dl className="flex flex-1 flex-col justify-center px-5 py-4 sm:px-7">
        {p.strategy.map((s) => (
          <div key={s.label} className="grid gap-1 border-b border-line py-4 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-6">
            <dt className="text-label text-fg-muted">{s.label}</dt>
            <dd className="text-body text-fg-hi">{s.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Visual({ p }: { p: Project }) {
  if (p.media) return <ProjectVideo media={p.media} />;
  if (p.screenshots)
    return (
      <ProjectLink p={p}>
        <ProjectStage screens={p.screenshots} label={p.name} />
      </ProjectLink>
    );
  return <TestSummary p={p} />;
}

// One card in the rail: screens on top, then the story in brief.
function ProjectCard({ p }: { p: Project }) {
  return (
    <article
      aria-labelledby={`${p.slug}-title`}
      className="flex flex-col gap-5 rounded-card border border-line bg-surface-1/40 p-3 transition-colors hover:border-line-hi sm:p-4"
    >
      <div className="min-w-0">
        <Visual p={p} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 px-2 pb-2">
        <p className="text-eyebrow font-semibold uppercase text-flame">
          {p.tag ?? `${p.category} · ${p.platforms.join(', ')}`}
        </p>
        <h3 id={`${p.slug}-title`} className="font-display text-title font-semibold text-fg-hi">
          {p.name}
        </h3>
        <p className="text-body-sm text-fg-muted">{p.summary}.</p>
        <ul className="flex flex-col gap-2">
          {p.results.slice(0, 2).map((r) => (
            <li key={r} className="grid grid-cols-[0.5rem_1fr] items-baseline gap-2.5 text-body-sm text-fg">
              <span aria-hidden="true" className="size-1.5 -translate-y-0.5 rounded-sm bg-flame" />
              {r}
            </li>
          ))}
        </ul>
        <p className="mt-auto flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-line pt-4">
          <span className="font-mono text-heading font-medium whitespace-nowrap text-flame tabular-nums">{p.metric.value}</span>
          <span className="font-mono text-caption uppercase tracking-wide text-fg-muted">{p.metric.label}</span>
        </p>
      </div>
    </article>
  );
}

export function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-heading" className="scroll-mt-16 overflow-x-clip">
      <Container className="flex flex-col gap-12 pt-24 pb-12 sm:gap-16 sm:pt-36 sm:pb-16">
        <SectionHeading id="work-heading" eyebrow={work.eyebrow} lines={work.heading} />
        <ProjectCarousel
          items={projects.map((p) => ({ slug: p.slug, name: p.name }))}
        >
          {projects.map((p) => (
            <ProjectCard key={p.slug} p={p} />
          ))}
        </ProjectCarousel>
      </Container>
    </section>
  );
}
