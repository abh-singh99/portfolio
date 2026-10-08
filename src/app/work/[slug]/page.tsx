import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject, projects } from '@/content/projects';
import { Container } from '@/components/layout/Container';

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return { title: `${project.name} case study`, description: `${project.summary}. ${project.outcome}` };
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-line py-10 lg:grid-cols-12 lg:gap-8" data-reveal>
      <h2 className="text-heading font-semibold text-fg-hi lg:col-span-4">{title}</h2>
      <div className="lg:col-span-8">{children}</div>
    </section>
  );
}

export default async function CaseStudy({ params }: { params: Promise<Params> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article>
      <Container className="flex flex-col gap-10 pt-12 pb-16 sm:pt-20">
        <Link href="/#work" className="w-fit text-label font-medium text-link hover:text-link-hi">
          ← All work
        </Link>

        <header className="flex flex-col gap-6" data-reveal>
          <p className="font-mono text-label text-fg-muted">{project.id}</p>
          <h1 className="font-display text-hero font-semibold text-fg-hi">{project.name}</h1>
          <p className="max-w-2xl text-subheading text-fg">{project.overview}</p>
        </header>

        <dl className="grid gap-6 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
          <div className="flex flex-col gap-1">
            <dt className="text-label text-fg-muted">Company</dt>
            <dd className="text-body text-fg-hi">{project.company}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-label text-fg-muted">Period</dt>
            <dd className="text-body text-fg-hi">{project.period}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-label text-fg-muted">Platforms</dt>
            <dd className="text-body text-fg-hi">{project.platforms.join(', ')}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-label text-fg-muted first-letter:uppercase">{project.metric.label}</dt>
            <dd className="font-mono text-title font-medium text-flame tabular-nums">{project.metric.value}</dd>
          </div>
        </dl>
      </Container>

      <Container className="pb-12">
        <Block title="The problem">
          <p className="max-w-2xl text-subheading text-fg">{project.problem}</p>
        </Block>

        <Block title="My role">
          <p className="max-w-2xl text-subheading text-fg">{project.role}</p>
        </Block>

        <Block title="What I tested">
          <ul className="grid gap-x-8 gap-y-2 text-body text-fg sm:grid-cols-2">
            {project.scope.map((s) => (
              <li key={s} className="border-b border-line py-2">
                {s}
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Test strategy">
          <dl className="flex flex-col">
            {project.strategy.map((s) => (
              <div key={s.label} className="grid gap-1 border-b border-line py-3 sm:grid-cols-[12rem_1fr] sm:gap-6">
                <dt className="text-label font-medium text-fg-muted">{s.label}</dt>
                <dd className="text-body text-fg-hi">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block title="Results">
          <ul className="flex flex-col gap-3">
            {project.results.map((r) => (
              <li key={r} className="flex gap-3 text-subheading text-fg">
                <span aria-hidden="true" className="text-fg-muted">→</span>
                {r}
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Tools">
          <p className="text-body text-fg">{project.tools.join(' · ')}</p>
        </Block>
      </Container>

      <Container className="pb-24">
        <Link
          href={`/work/${next.slug}`}
          className="group flex flex-col gap-2 border-t border-line pt-8 hover:text-fg-hi"
        >
          <span className="text-label text-fg-muted">Next case study</span>
          <span className="font-display text-statement font-semibold text-fg-hi">
            {next.name} <span className="text-link group-hover:text-link-hi">→</span>
          </span>
        </Link>
      </Container>
    </article>
  );
}
