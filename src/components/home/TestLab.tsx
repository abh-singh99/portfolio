'use client';

import { testLab } from '@/content/lab';
import { Container } from '@/components/layout/Container';
import { useLab } from '@/components/lab/LabProvider';
import { LabIcon } from '@/components/lab/icons';
import { SectionHeading } from './SectionHeading';

// Five demo cards after the toolkit. A card grows on hover so the click feels
// natural; one click opens its demo in the Test Lab modal.
export function TestLab() {
  const { open, done } = useLab();
  return (
    <section id="lab" aria-labelledby="lab-heading" className="scroll-mt-16">
      <Container className="flex flex-col gap-10 pb-24 sm:pb-36">
        <SectionHeading id="lab-heading" eyebrow={testLab.eyebrow} lines={testLab.heading} size="section" align="left" />
        <p className="max-w-3xl text-lead text-fg-muted">
          {testLab.lead}
        </p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {testLab.cards.map((c, i) => {
            const Icon = LabIcon[c.id];
            return (
              <li key={c.id} className="flex">
                <button
                  type="button"
                  onClick={() => open(c.id)}
                  aria-label={`${c.title}: ${c.body}`}
                  className="lab-card relative flex w-full flex-col gap-4 rounded-card border border-line bg-surface-0 p-5 text-left"
                >
                  <span className="lab-card-icon grid size-11 place-items-center rounded-card bg-flame/15 text-flame">
                    <Icon />
                  </span>
                  <span className="font-mono text-caption text-fg-muted">
                    {String(i + 1).padStart(2, '0')} · {c.kind}
                  </span>
                  <span className="font-display text-heading font-semibold text-fg-hi">{c.title}</span>
                  <span className="text-body-sm text-fg-muted">{c.body}</span>
                  <span className="font-mono text-caption text-fg-muted">{c.meta}</span>
                  <span className="mt-auto inline-flex items-center gap-2 text-label font-semibold text-fg-hi">
                    {c.cta}
                    <span aria-hidden="true" className="lab-card-arrow text-flame">
                      →
                    </span>
                  </span>
                  {done.has(c.id) && (
                    <span className="absolute top-5 right-5 font-mono text-caption font-semibold text-success">
                      ✓ {testLab.done}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
