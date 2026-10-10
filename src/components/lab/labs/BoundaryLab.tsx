'use client';

import { useEffect, useState } from 'react';
import { boundaryLab } from '@/content/lab';
import { accepts, coverage, partition, sets, type BoundaryBuild } from '@/lib/lab/boundary';
import { BrowserWindow, Guide, Html, Pill, RealWork } from '../chrome';
import { useLab } from '../LabProvider';

const MIN = 18;
const MAX = 70;
const BUILDS: { id: BoundaryBuild; label: string }[] = [
  { id: 'upper', label: 'Build 2.3 (defect at upper edge)' },
  { id: 'lower', label: 'Build 2.2 (defect at lower edge)' },
  { id: 'none', label: 'Build 2.4 (no defect)' },
];

export function BoundaryLab() {
  const { markDone } = useLab();
  const [build, setBuild] = useState<BoundaryBuild>('upper');
  const [values, setValues] = useState<number[]>([30]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [last, setLast] = useState<number | null>(null);

  const add = (list: number[]) => setValues((v) => [...new Set([...v, ...list])].slice(0, 30));
  const test = () => {
    if (!/^-?\d{1,4}$/.test(input.trim())) return setError('Enter a whole number, for example 17.');
    const v = parseInt(input, 10);
    setError('');
    setLast(v);
    add([v]);
    setInput('');
  };

  const sorted = [...values].sort((a, b) => a - b);
  const rows = sorted.map((v) => {
    const expected = v >= MIN && v <= MAX;
    const actual = accepts(v, MIN, MAX, build);
    return { v, actual, miss: expected !== actual };
  });
  const cov = coverage(MIN, MAX, sorted);
  const core = cov.filter((c) => c.core && c.hit).length;
  const missed = rows.filter((r) => r.miss).map((r) => r.v);
  const exposed = build !== 'none' && missed.length > 0;

  const lo = Math.min(MIN, ...sorted) - 6;
  const hi = Math.max(MAX, ...sorted) + 6;
  const pct = (x: number) => ((x - lo) / (hi - lo)) * 100;
  const lastRow = last === null ? null : rows.find((r) => r.v === last);

  const verdict = build === 'none' ? boundaryLab.none : exposed ? boundaryLab.exposed(missed.join(', ')) : boundaryLab.hidden;
  const finished = exposed && core === 4;
  useEffect(() => {
    if (finished) markDone('boundary');
  }, [finished, markDone]);

  return (
    <>
      <Guide text={finished ? `${verdict} ${boundaryLab.finish}` : `${boundaryLab.steps[0]}`} finished={finished} label={finished ? undefined : 'Test design'} />
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <BrowserWindow tab="Book a track day · Apex Parts" favicon="#c8102e" url="shop.apex-parts.test/track-days/silverstone">
          <div className="shop">
            <div className="shop-nav">
              <span className="shop-logo">
                APEX<i>/</i>PARTS
              </span>
            </div>
            <div className="flex flex-col gap-3 p-5">
              <h3>Silverstone track day</h3>
              <p style={{ color: '#555', fontSize: 13 }}>Open to drivers aged 18 to 70 on the day. Full UK licence required.</p>
              <form
                className="flex flex-wrap items-end gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  test();
                }}
              >
                <div className="shop-field">
                  <label htmlFor="bva-age">{boundaryLab.field}</label>
                  <input id="bva-age" inputMode="numeric" autoComplete="off" value={input} onChange={(e) => setInput(e.target.value)} style={{ width: 130 }} aria-describedby="bva-err" />
                </div>
                <button type="submit" className="shop-cta">
                  Check eligibility
                </button>
              </form>
              <span className="shop-err" id="bva-err">{error}</span>
              {lastRow && (
                <p className={`shop-confirm ${lastRow.actual ? '' : 'is-bad'}`} style={{ margin: 0 }} role="status">
                  Age {lastRow.v}: {lastRow.actual ? 'eligible. You can book this day.' : 'not eligible for this track day.'}
                </p>
              )}
            </div>
          </div>
        </BrowserWindow>

        <div className="lab-panel flex flex-col">
          <div className="lab-panel-h justify-between">
            <span className="text-label font-semibold text-fg-hi">Test design · age 18–70</span>
            <label className="flex items-center gap-2 text-caption text-fg-muted">
              Build under test
              <select
                value={build}
                onChange={(e) => setBuild(e.target.value as BoundaryBuild)}
                className="rounded border border-line-hi bg-surface-2 px-2 py-1 text-caption text-fg-hi"
              >
                {BUILDS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-col gap-4 p-4">
            <Html as="p" html={verdict} className={`lab-explain ${build === 'none' ? '' : exposed ? 'is-bad' : ''}`} />
            <div className="nl" role="img" aria-label={`Number line from ${MIN} to ${MAX} with ${sorted.length} tested values`}>
              <div className="nl-track" />
              <div className="nl-valid" style={{ left: `${pct(MIN)}%`, width: `${pct(MAX) - pct(MIN)}%` }} />
              <span className="nl-tag" style={{ left: 0 }}>invalid</span>
              <span className="nl-tag" style={{ left: `${(pct(MIN) + pct(MAX)) / 2}%`, transform: 'translateX(-50%)' }}>valid</span>
              <span className="nl-tag" style={{ right: 0 }}>invalid</span>
              <span className="nl-tick" style={{ left: `${pct(MIN)}%` }}>{MIN}</span>
              <span className="nl-tick" style={{ left: `${pct(MAX)}%` }}>{MAX}</span>
              {rows.map((r) => (
                <span
                  key={r.v}
                  className={`nl-dot ${r.actual ? 'is-ok' : 'is-no'} ${r.miss ? 'is-hit' : ''}`}
                  style={{ left: `${pct(r.v)}%` }}
                  title={`${r.v}: ${r.actual ? 'accepted' : 'rejected'}`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="lab-btn" onClick={() => add(sets.two(MIN, MAX))}>+ 2-value BVA set</button>
              <button type="button" className="lab-btn" onClick={() => add(sets.three(MIN, MAX))}>+ 3-value BVA set</button>
              <button type="button" className="lab-btn" onClick={() => add(sets.robust(MIN, MAX))}>+ Robust set</button>
              <button type="button" className="lab-btn" onClick={() => { setValues([]); setLast(null); }}>Clear</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <p className="text-label font-semibold text-fg-hi">Values tested</p>
                <ul className="flex flex-col gap-1.5">
                  {rows.length === 0 && <li className="text-body-sm text-fg-muted">No values yet.</li>}
                  {rows.map((r) => (
                    <li key={r.v} className="flex flex-wrap items-center gap-2 font-mono text-caption">
                      <b className="text-fg-hi">{r.v}</b>
                      <span className="text-fg-muted">{partition(r.v, MIN, MAX)}</span>
                      <span>→ {r.actual ? 'accepted' : 'rejected'}</span>
                      {r.miss && <Pill tone="fail">Defect</Pill>}
                      <button type="button" aria-label={`Remove ${r.v}`} className="ml-auto text-fg-muted hover:text-fg-hi" onClick={() => setValues(values.filter((x) => x !== r.v))}>
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-label font-semibold text-fg-hi">Coverage</p>
                  <Pill tone={core === 4 ? 'pass' : core ? 'warn' : undefined}>core edges {core}/4</Pill>
                </div>
                <ul className="flex flex-col gap-1.5 text-body-sm">
                  {cov.map((c) => (
                    <li key={c.label} className="flex items-center gap-2">
                      <Pill tone={c.hit ? 'pass' : undefined}>{c.hit ? 'Tested' : 'Missing'}</Pill>
                      <span className={c.core ? 'text-fg' : 'text-fg-muted'}>{c.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-caption text-fg-muted">{boundaryLab.partitions}</p>
          </div>
        </div>
      </div>
      <RealWork text={boundaryLab.real} />
    </>
  );
}
