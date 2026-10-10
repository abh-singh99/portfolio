'use client';

import { useRef, useState } from 'react';
import { functionalLab } from '@/content/lab';
import { expose, VALID, EMPTY, type CheckoutForm, type DefectId, type Submission } from '@/lib/lab/checkout';
import { BrowserWindow, Explain, Guide, Html, Pill, RealWork } from '../chrome';
import { CheckoutPage } from '../CheckoutPage';
import { useLab } from '../LabProvider';
import { useMedia, WIDE } from '../responsive';

const total = functionalLab.defects.length;
const sevTone = (s: string) => (s === 'Critical' ? 'fail' : s === 'Major' ? 'warn' : undefined);

export function FunctionalLab() {
  const { markDone } = useLab();
  // Side panels open beside the shop on wide screens; on narrow ones they
  // collapse to one-line summaries under it.
  const wide = useMedia(WIDE);
  const notesRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<CheckoutForm>(EMPTY);
  const [result, setResult] = useState<Submission | null>(null);
  const [found, setFound] = useState<Map<DefectId, string>>(new Map());
  const [hints, setHints] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<{ html: string; tone: 'info' | 'good' | 'bad' }[]>([]);

  const submit = () => {
    const { result: r, hits } = expose(form);
    setResult(r);
    const next = new Map(found);
    const msgs = hits.map((h) => {
      const d = functionalLab.defects.find((x) => x.id === h.id)!;
      const isNew = !next.has(h.id);
      if (isNew) next.set(h.id, h.input);
      return { html: `<b>${d.id} · ${d.title}.</b> Build 1.0 disagrees with the requirements${isNew ? ' (added to the bug board)' : ' (already on the board)'}.`, tone: 'bad' as const };
    });
    setFound(next);
    setNotes(msgs.length ? msgs : [{ html: functionalLab.noDefect, tone: 'info' }]);
    if (next.size === total) markDone('functional');
    // On narrow screens the verdict lands below the order summary, out of view.
    if (!wide) requestAnimationFrame(() => notesRef.current?.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
  };

  const n = found.size;
  return (
    <>
      <Guide
        step={1}
        text={n === total ? functionalLab.finish : n ? functionalLab.progress(n, total) : functionalLab.steps[0]}
        finished={n === total}
        label={n === total ? undefined : `Exploratory session · ${n}/${total} defects`}
      />
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-3">
          <BrowserWindow tab="Checkout · Apex Parts" favicon="#c8102e" url="shop.apex-parts.test/checkout" extraTabs={[['Requirements · Confluence', '#1868db']]}>
            <CheckoutPage
              idPrefix="fx"
              form={form}
              result={result}
              onChange={setForm}
              onSubmit={submit}
              onFillValid={() => {
                setForm(VALID);
                setResult(null);
              }}
            />
          </BrowserWindow>
          <div ref={notesRef} className="flex scroll-mb-4 flex-col gap-2" aria-live="polite">
            {notes.map((m) => (
              <Explain key={m.html} html={m.html} tone={m.tone} />
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <details className="lab-panel lab-disclosure" open={wide}>
            <summary className="lab-panel-h text-label font-semibold text-fg-hi">
              Requirements · checkout v1
              <span className="ml-auto font-mono text-caption font-normal text-fg-muted">{functionalLab.requirements.length} rules</span>
            </summary>
            <ol className="flex list-decimal flex-col gap-1.5 py-3 pr-4 pl-9 text-body-sm text-fg-muted">
              {functionalLab.requirements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ol>
          </details>
          <details className="lab-panel lab-disclosure" open={wide}>
            <summary className="lab-panel-h text-label font-semibold text-fg-hi">
              Bug board · build 1.0
              <span className="ml-auto">
                <Pill tone={n === total ? 'pass' : n ? 'warn' : undefined}>
                  {n} / {total} found
                </Pill>
              </span>
            </summary>
            <ul className="flex max-h-96 flex-col gap-2 overflow-y-auto p-3 lg:max-h-none">
              {functionalLab.defects.map((d) => {
                const input = found.get(d.id as DefectId);
                return (
                  <li key={d.id} className={`bug-card ${input ? 'is-found' : 'is-locked'}`}>
                    <div className="flex items-center justify-between gap-2 font-mono text-caption text-fg-muted">
                      <span>
                        {d.id} · {d.area}
                      </span>
                      {input ? <Pill tone={sevTone(d.severity)}>{d.severity}</Pill> : <Pill>Not found</Pill>}
                    </div>
                    {input ? (
                      <>
                        <p className="font-semibold text-fg-hi">{d.title}</p>
                        <dl>
                          <dt>Input</dt>
                          <dd className="font-mono">{input}</dd>
                          <dt>Expected</dt>
                          <dd>{d.expected}</dd>
                          <dt>Actual</dt>
                          <dd className="text-error">{d.actual}</dd>
                          <dt>Technique</dt>
                          <dd>{d.technique}</dd>
                        </dl>
                      </>
                    ) : hints.has(d.id) ? (
                      <Html as="p" html={d.hint} className="text-fg-muted" />
                    ) : (
                      <button
                        type="button"
                        className="w-fit text-caption font-semibold text-link hover:text-link-hi"
                        onClick={() => setHints(new Set(hints).add(d.id))}
                      >
                        Show hint
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </details>
        </div>
      </div>
      <RealWork text={functionalLab.real} />
    </>
  );
}
