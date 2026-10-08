import { flowqa } from '@/content/home';
import { Container } from '@/components/layout/Container';
import { Pill } from '@/components/ui';
import { SectionHeading } from './SectionHeading';

export function FlowQASpotlight() {
  return (
    <section id="flowqa" aria-labelledby="flowqa-heading" className="border-t border-line bg-surface-1">
      <Container className="flex flex-col gap-16 py-24 sm:py-36">
        <div className="flex flex-col items-center gap-6 text-center">
          <SectionHeading id="flowqa-heading" eyebrow={flowqa.eyebrow} lines={flowqa.heading} />
          <p className="max-w-2xl text-lead text-fg-muted" data-reveal>
            {flowqa.lead}
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <ul className="flex flex-col lg:col-span-5" data-reveal>
            {flowqa.features.map((f) => (
              <li key={f.title} className="flex flex-col gap-1 border-t border-line py-4">
                <h3 className="text-body font-semibold text-fg-hi">{f.title}</h3>
                <p className="text-body-sm text-fg-muted">{f.body}</p>
              </li>
            ))}
          </ul>

          <div className="flex min-w-0 flex-col justify-center gap-6 lg:col-span-7">
            <figure className="flex min-w-0 flex-col gap-3" data-reveal>
              <div className="overflow-hidden rounded-card border border-line bg-surface-0">
                <div className="flex items-center gap-2 border-b border-line px-4 py-3" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-surface-3" />
                  <span className="size-2.5 rounded-full bg-surface-3" />
                  <span className="size-2.5 rounded-full bg-surface-3" />
                  <span className="ml-3 font-mono text-caption text-fg-muted">checkout.spec.ts</span>
                </div>
                {/* Focusable so keyboard users can scroll the snippet when it overflows. */}
                <pre
                  tabIndex={0}
                  aria-label={flowqa.codeCaption}
                  className="scroll-thin overflow-x-auto p-5 font-mono text-body-sm text-fg sm:p-6"
                >
                  <code>{flowqa.code}</code>
                </pre>
              </div>
              <figcaption className="text-caption text-fg-muted">{flowqa.codeCaption}</figcaption>
            </figure>
            <div className="flex flex-wrap items-center justify-between gap-4" data-reveal>
              <p className="text-label text-fg-muted">
                {flowqa.exportsLabel} <span className="font-mono text-fg">{flowqa.exports.join(', ')}</span>
              </p>
              <Pill href="/work/flowqa" arrow>
                {flowqa.cta}
              </Pill>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
