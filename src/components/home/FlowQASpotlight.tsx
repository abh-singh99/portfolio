import Link from 'next/link';
import { flowqa } from '@/content/home';
import { Section } from './Section';

export function FlowQASpotlight() {
  return (
    <Section id="flowqa" heading={flowqa.heading} intro={flowqa.lead}>
      <div className="flex flex-col gap-10">
        <figure className="flex flex-col gap-3" data-reveal>
          {/* Focusable so keyboard users can scroll the snippet when it overflows. */}
          <pre
            tabIndex={0}
            aria-label={flowqa.codeCaption}
            className="scroll-thin overflow-x-auto rounded-card border border-line bg-surface-1 p-5 font-mono text-body-sm text-fg sm:p-6">
            <code>{flowqa.code}</code>
          </pre>
          <figcaption className="text-caption text-fg-muted">{flowqa.codeCaption}</figcaption>
        </figure>

        <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
          {flowqa.features.map((f) => (
            <li key={f.title} className="flex flex-col gap-1" data-reveal>
              <h3 className="text-body font-semibold text-fg-hi">{f.title}</h3>
              <p className="text-body-sm text-fg-muted">{f.body}</p>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6" data-reveal>
          <p className="text-label text-fg-muted">
            {flowqa.exportsLabel}{' '}
            {flowqa.exports.map((e, i) => (
              <span key={e}>
                <span className="font-mono text-fg">{e}</span>
                {i < flowqa.exports.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
          <Link href="/work/flowqa" className="text-label font-medium text-link hover:text-link-hi">
            {flowqa.cta} →
          </Link>
        </div>
      </div>
    </Section>
  );
}
