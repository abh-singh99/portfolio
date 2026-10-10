import { bugReport } from '@/content/lab';
import { Container } from '@/components/layout/Container';
import { OpenLab } from '@/components/lab/OpenLab';
import { SectionHeading } from './SectionHeading';

// A sample defect report in the format Abhay files them, taken from the Test Lab
// checkout so readers can reproduce it.
export function BugReport() {
  const r = bugReport;
  return (
    <section id="bug-report" aria-labelledby="bug-report-heading" className="scroll-mt-16">
      <Container className="flex flex-col gap-10 pb-24 sm:pb-36">
        <SectionHeading id="bug-report-heading" eyebrow={r.eyebrow} lines={r.heading} size="section" align="left" />
        <p className="max-w-3xl text-lead text-fg-muted">
          {r.lead}
        </p>
        <article className="overflow-hidden rounded-card border border-line bg-surface-1" aria-labelledby="bug-report-title">
          <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-5 py-4 sm:px-8">
            <span className="font-mono text-label text-link">{r.id}</span>
            <span className="rounded-full border border-error px-2.5 py-0.5 font-mono text-caption font-semibold text-error">Critical</span>
            <span className="rounded-full border border-line-hi px-2.5 py-0.5 font-mono text-caption text-fg-muted">Open</span>
            <h3 id="bug-report-title" className="w-full font-display text-heading font-semibold text-fg-hi">
              {r.title}
            </h3>
          </header>
          <dl className="grid gap-x-8 gap-y-5 px-5 py-6 sm:grid-cols-[11rem_1fr] sm:px-8">
            {r.fields.map((f) => (
              <div key={f.label} className="contents">
                <dt className="font-mono text-caption tracking-wide text-fg-muted uppercase">{f.label}</dt>
                <dd className="text-body text-fg">{f.value}</dd>
              </div>
            ))}
            <dt className="font-mono text-caption tracking-wide text-fg-muted uppercase">{r.labels.steps}</dt>
            <dd>
              <ol className="flex list-decimal flex-col gap-1 pl-5 text-body text-fg">
                {r.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </dd>
            <dt className="font-mono text-caption tracking-wide text-fg-muted uppercase">{r.labels.expected}</dt>
            <dd className="text-body text-fg">{r.expected}</dd>
            <dt className="font-mono text-caption tracking-wide text-fg-muted uppercase">{r.labels.actual}</dt>
            <dd className="text-body text-error">{r.actual}</dd>
            <dt className="font-mono text-caption tracking-wide text-fg-muted uppercase">{r.labels.cause}</dt>
            <dd className="text-body text-fg">{r.cause}</dd>
            <dt className="font-mono text-caption tracking-wide text-fg-muted uppercase">{r.labels.regression}</dt>
            <dd className="font-mono text-body-sm text-fg">{r.regression}</dd>
          </dl>
          <div className="border-t border-line px-5 py-4 sm:px-8">
            <OpenLab lab="functional" label={r.reproduce} />
          </div>
        </article>
      </Container>
    </section>
  );
}
