import { bugReport } from '@/content/lab';
import { Container } from '@/components/layout/Container';
import { OpenLab } from '@/components/lab/OpenLab';
import { SectionHeading } from './SectionHeading';

const label = 'font-mono text-caption tracking-wide text-fg-muted uppercase';

// A sample defect report in the format Abhay files them, taken from the Test Lab
// checkout so readers can reproduce it.
export function BugReport() {
  const r = bugReport;
  return (
    <section id="bug-report" aria-labelledby="bug-report-heading" className="scroll-mt-16">
      <Container className="flex flex-col gap-8 pb-24 sm:pb-32">
        <SectionHeading id="bug-report-heading" eyebrow={r.eyebrow} lines={r.heading} size="section" align="left" />
        <p className="max-w-3xl text-lead text-fg-muted" data-reveal>
          {r.lead}
        </p>
        <article className="overflow-hidden rounded-card border border-line bg-surface-1" aria-labelledby="bug-report-title" data-reveal>
          <header className="flex flex-col gap-2 border-b border-line px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-label text-link">{r.id}</span>
              <span className="rounded-full border border-error px-2 py-0.5 font-mono text-caption font-semibold text-error">{r.severity}</span>
              <span className="rounded-full border border-line-hi px-2 py-0.5 font-mono text-caption text-fg-muted">{r.status}</span>
            </div>
            <h3 id="bug-report-title" className="font-display text-heading font-semibold text-fg-hi">
              {r.title}
            </h3>
            <p className="font-mono text-caption text-fg-muted">{r.meta.join(' · ')}</p>
          </header>
          <div className="grid gap-5 px-5 py-5 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] md:gap-8">
            <div className="flex flex-col gap-2">
              <h4 className={label}>{r.labels.steps}</h4>
              <ol className="flex list-decimal flex-col gap-1 pl-5 text-body-sm text-fg">
                {r.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className={label}>{r.labels.expected}</h4>
              <p className="text-body-sm text-fg">{r.expected}</p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className={label}>{r.labels.actual}</h4>
              <p className="text-body-sm text-error">{r.actual}</p>
            </div>
          </div>
          <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-5 py-4 sm:px-6">
            <dl className="grid gap-x-4 gap-y-1 text-body-sm sm:grid-cols-[auto_1fr]">
              <dt className={label}>{r.labels.cause}</dt>
              <dd className="text-fg">{r.cause}</dd>
              <dt className={label}>{r.labels.regression}</dt>
              <dd className="font-mono text-caption text-fg">{r.regression}</dd>
            </dl>
            <OpenLab lab="functional" label={r.reproduce} />
          </footer>
        </article>
      </Container>
    </section>
  );
}
