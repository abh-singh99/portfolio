'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { AxeResults, Result } from 'axe-core';
import { a11yLab } from '@/content/lab';
import { BrowserWindow, Explain, Guide, RealWork } from '../chrome';
import { useAlive, useLab } from '../LabProvider';

type Build = '1.0' | '1.1';

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16">
    <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" fill="none" strokeWidth="2" />
  </svg>
);

// The sign-up form under audit. Build 1.0 has real WCAG failures that axe-core
// detects: an image with no alt text, an unlabelled input, low-contrast hint
// text, an icon button with no name and an empty link.
function Specimen({ build }: { build: Build }) {
  const fixed = build === '1.1';
  return (
    <div className="spec">
      <p className="spec-title">Join the Apex pit lane</p>
      {/* Missing alt on 1.0 is one of the planted violations. */}
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img
        className="spec-img"
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        {...(fixed ? { alt: '' } : {})}
      />
      {fixed ? (
        <label className="spec-label" htmlFor="spec-email">
          Email address
        </label>
      ) : (
        <span className="spec-label">Email address</span>
      )}
      <input className="spec-input" type="email" {...(fixed ? { id: 'spec-email', autoComplete: 'email' } : {})} />
      <p className={`spec-hint ${fixed ? 'is-ok' : ''}`}>One email a month: new parts and track days.</p>
      <div className="flex items-center justify-between">
        <button type="button" className="spec-btn" {...(fixed ? { 'aria-label': 'Subscribe' } : {})}>
          <Arrow />
        </button>
        <a className="spec-link" href="#privacy" onClick={(e) => e.preventDefault()}>
          {fixed ? 'Privacy policy' : ''}
        </a>
      </div>
    </div>
  );
}

export function A11yLab() {
  const alive = useAlive();
  const { markDone } = useLab();
  const [build, setBuild] = useState<Build>('1.0');
  const [results, setResults] = useState<{ build: Build; res: AxeResults } | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const specRef = useRef<HTMLDivElement>(null);

  const scan = async () => {
    if (!specRef.current) return;
    setBusy(true);
    setError('');
    setSelected(null);
    try {
      const axe = (await import('axe-core')).default;
      const res = await axe.run(specRef.current, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
      });
      if (!alive.current) return;
      setResults({ build, res });
      if (build === '1.0' && res.violations.length && step === 1) setStep(2);
      if (build === '1.1' && res.violations.length === 0) {
        setStep(4);
        markDone('a11y');
      }
    } catch (e) {
      if (alive.current) setError(`The scan could not finish: ${e instanceof Error ? e.message : 'unknown error'}`);
    } finally {
      if (alive.current) setBusy(false);
    }
  };

  // Highlight the element behind the selected violation.
  const violations: Result[] = useMemo(() => results?.res.violations ?? [], [results]);
  useEffect(() => {
    const root = specRef.current;
    if (!root) return;
    root.querySelectorAll('[data-hl]').forEach((el) => el.removeAttribute('data-hl'));
    if (selected === null) return;
    const target = violations[selected]?.nodes[0]?.target[0];
    if (typeof target === 'string') root.querySelector(target)?.setAttribute('data-hl', 'true');
  }, [selected, violations]);

  const stale = results && results.build !== build;
  const text = step === 4 ? a11yLab.finish : a11yLab.steps[step - 1];

  return (
    <>
      <Guide step={Math.min(step, 3)} total={3} finished={step === 4} text={text} />
      <BrowserWindow tab="Newsletter · Apex Parts" favicon="#c8102e" url={`staging-${build.replace('.', '-')}.apex-parts.test/newsletter`}>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          {/* Deliberately inaccessible on build 1.0: this is the thing being audited. */}
          <div ref={specRef} data-a11y-specimen className="bg-[#f6f7f9] px-4 py-2" aria-label="Sign-up form under audit">
            <Specimen build={build} />
          </div>
          <div className="devtools lg:border-t-0 lg:border-l">
            <div className="devtools-tabs" aria-hidden="true">
              <span>Elements</span>
              <span>Console</span>
              <span className="on">Accessibility scan</span>
            </div>
            <div className="devtools-bar">
              <label className="flex items-center gap-2">
                Build
                <select
                  value={build}
                  onChange={(e) => {
                    setBuild(e.target.value as Build);
                    setSelected(null);
                    if (step === 2 || step === 3) setStep(3);
                  }}
                >
                  <option value="1.0">1.0 (current)</option>
                  <option value="1.1">1.1 (with fixes)</option>
                </select>
              </label>
              <button
                type="button"
                className={`devtools-scan ${step === 1 || (step === 3 && build === '1.1') ? 'lab-nudge' : ''}`}
                onClick={scan}
                disabled={busy}
              >
                {busy ? 'Scanning…' : 'Run scan'}
              </button>
              <span role="status" style={{ color: '#5f6368' }}>
                {error ||
                  (results && !stale
                    ? `${results.res.violations.length} violations · ${results.res.passes.length} rules passed · ${results.res.incomplete.length} to review`
                    : stale
                      ? 'Build changed. Run the scan again.'
                      : 'axe-core 4.10 · WCAG 2.2 A/AA')}
              </span>
            </div>
            {results && !stale && (
              <ul className="devtools-list">
                {violations.length === 0 && (
                  <li style={{ padding: 8 }}>
                    <b className="c-ok">No automated violations found.</b>
                    <p style={{ color: '#5f6368', marginTop: 4 }}>{a11yLab.caveat}</p>
                  </li>
                )}
                {violations.map((v, i) => (
                  <li key={v.id}>
                    <button
                      type="button"
                      className={selected === i ? 'is-on' : ''}
                      aria-pressed={selected === i}
                      onClick={() => {
                        setSelected(i);
                        if (step === 2) setStep(3);
                      }}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <b>{v.help}</b>
                        <span className={`imp ${v.impact ?? 'minor'}`}>{v.impact ?? 'minor'}</span>
                      </span>
                      <span style={{ color: '#5f6368' }}>
                        Rule <span className="font-mono">{v.id}</span> · {v.tags.filter((t) => /^wcag\d{3,}$/.test(t)).map((t) => t.replace('wcag', 'WCAG ').replace(/(\d)(\d)(\d+)?$/, '$1.$2.$3').replace(/\.$/, '')).join(', ')}
                      </span>
                      <code>{v.nodes[0]?.html}</code>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </BrowserWindow>
      <Explain html={a11yLab.intro} />
      <RealWork text={a11yLab.real} />
    </>
  );
}
