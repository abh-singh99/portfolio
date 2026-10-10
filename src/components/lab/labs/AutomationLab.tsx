'use client';

import { useCallback, useRef, useState } from 'react';
import { automationLab } from '@/content/lab';
import { EMPTY, VALID, FIELDS, submit, type Build, type CheckoutForm, type Submission } from '@/lib/lab/checkout';
import { SUITE } from '@/lib/lab/suite';
import { BrowserWindow, EditorWindow, Explain, Guide, RealWork } from '../chrome';
import { CheckoutPage } from '../CheckoutPage';
import { CursorIcon } from '../icons';
import { pause, useAlive, useLab } from '../LabProvider';
import { ScaledViewport } from '../responsive';

type Status = 'queued' | 'run' | 'pass' | 'fail';
type Outcome = { pass: boolean; expected: string; actual: string; ms: number };

// Minimal TypeScript highlighting for the editor: strings, comments, keywords.
function highlight(line: string) {
  const parts = line.split(/('[^']*'|\/\/.*$)/g);
  return parts.map((p, i) =>
    p.startsWith("'") ? (
      <span key={i} className="str">{p}</span>
    ) : p.startsWith('//') ? (
      <span key={i} className="cm">{p}</span>
    ) : (
      <span key={i}>
        {p.split(/\b(await|const|for|of|async|test|expect)\b/g).map((w, j) =>
          /^(await|const|for|of|async)$/.test(w) ? (
            <span key={j} className="kw">{w}</span>
          ) : /^(test|expect)$/.test(w) ? (
            <span key={j} className="fn">{w}</span>
          ) : (
            w
          ),
        )}
      </span>
    ),
  );
}

export function AutomationLab() {
  const alive = useAlive();
  const { markDone } = useLab();
  const [build, setBuild] = useState<Build>('1.0');
  const [status, setStatus] = useState<Status[]>(() => SUITE.map(() => 'queued'));
  const [outcomes, setOutcomes] = useState<(Outcome | null)[]>(() => SUITE.map(() => null));
  const [shown, setShown] = useState(0);
  const [line, setLine] = useState<{ i: number; fail?: boolean } | null>(null);
  const [term, setTerm] = useState<React.ReactNode[]>([<span key="p" className="d">~/apex-e2e $ </span>]);
  const [form, setForm] = useState<CheckoutForm>(EMPTY);
  const [result, setResult] = useState<Submission | null>(null);
  const [running, setRunning] = useState(false);
  const [runs, setRuns] = useState<{ build: Build; failed: number }[]>([]);
  const [cursor, setCursor] = useState<{ x: number; y: number; click: number } | null>(null);
  const [failShot, setFailShot] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<HTMLPreElement>(null);
  const scale = useRef(1);
  const onScale = useCallback((s: number) => {
    scale.current = s;
  }, []);

  const log = (node: React.ReactNode) => {
    setTerm((t) => [...t, node]);
    requestAnimationFrame(() => termRef.current && (termRef.current.scrollTop = termRef.current.scrollHeight));
  };

  const pointAt = async (target: string, click = true) => {
    const page = pageRef.current;
    const el = page?.querySelector<HTMLElement>(`[data-target="${target}"]`);
    if (!page || !el) return;
    // Rects are in screen pixels; the preview may be scaled down on phones.
    const p = page.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const k = scale.current;
    const x = (r.left - p.left + Math.min(r.width / 2, 60 * k)) / k;
    const y = (r.top - p.top + r.height / 2) / k;
    setCursor((c) => ({ x, y, click: click ? (c?.click ?? 0) + 1 : (c?.click ?? 0) }));
    await pause(260);
  };

  const run = async () => {
    setRunning(true);
    setFailShot(false);
    setStatus(SUITE.map(() => 'queued'));
    setOutcomes(SUITE.map(() => null));
    setTerm([
      <span key="cmd"><span className="d">~/apex-e2e $</span> npx playwright test checkout.spec.ts --headed{'\n\n'}</span>,
      <span key="hdr">Running {SUITE.length} tests using 1 worker · target: build {build}{'\n\n'}</span>,
    ]);
    const t0 = performance.now();
    let failed = 0;
    const failures: { t: (typeof SUITE)[number]; o: Outcome; n: number }[] = [];

    for (let i = 0; i < SUITE.length; i++) {
      if (!alive.current) return;
      const t = SUITE[i];
      const ts = performance.now();
      setShown(i);
      setStatus((s) => s.map((x, k) => (k === i ? 'run' : x)));
      setFailShot(false);
      setResult(null);

      // Fill: the base form appears at once; the field under test is typed.
      const changed = FIELDS.filter((f) => t.fill[f] !== VALID[f]);
      setLine({ i: 1 });
      const base = { ...t.fill };
      changed.forEach((f) => (base[f] = ''));
      setForm(t.fill === EMPTY ? EMPTY : base);
      for (const f of changed) {
        await pointAt(f);
        const text = t.fill[f];
        for (let c = 1; c <= text.length; c += 3) {
          if (!alive.current) return;
          setForm((prev) => ({ ...prev, [f]: text.slice(0, c) }));
          await pause(16);
        }
        setForm((prev) => ({ ...prev, [f]: text }));
      }
      setLine({ i: 2 });
      await pointAt('submit');
      setResult(submit(t.fill, build));
      setLine({ i: t.code.length });
      await pause(220);
      if (!alive.current) return;

      const o = { ...t.run(build), ms: Math.round(performance.now() - ts) };
      setOutcomes((x) => x.map((v, k) => (k === i ? o : v)));
      setStatus((s) => s.map((x, k) => (k === i ? (o.pass ? 'pass' : 'fail') : x)));
      if (!o.pass) {
        failed++;
        failures.push({ t, o, n: failed });
        setLine({ i: t.code.length, fail: true });
        setFailShot(true);
        await pause(380);
      }
      log(
        <span key={`r${i}`}>
          {'  '}
          {o.pass ? <span className="g">✓</span> : <span className="r">✘</span>}
          {`  ${i + 1} [chromium] › checkout.spec.ts › ${t.id} ${t.title} `}
          <span className="d">({(o.ms / 1000).toFixed(1)}s)</span>
          {'\n'}
        </span>,
      );
    }
    if (!alive.current) return;

    const secs = ((performance.now() - t0) / 1000).toFixed(1);
    failures.forEach(({ t, o, n }) =>
      log(
        <span key={`f${n}`} className="r">
          {`\n  ${n}) checkout.spec.ts › ${t.id} ${t.title}\n\n     Expected: ${o.expected}\n     Received: ${o.actual}\n`}
          <span className="d">{`     attachment: screenshot → test-results/${t.id.toLowerCase()}/test-failed-1.png\n`}</span>
        </span>,
      ),
    );
    log(
      <span key="sum">
        {'\n  '}
        {failed > 0 && <span className="r">{failed} failed{'\n  '}</span>}
        <span className="g">{SUITE.length - failed} passed</span>
        <span className="d"> ({secs}s)</span>
        {'\n'}
      </span>,
    );
    setLine(null);
    setCursor(null);
    setRunning(false);
    setRuns((r) => [...r, { build, failed }]);
    if (build === '1.1' && failed === 0) markDone('automation');
  };

  const last = runs.at(-1);
  const finished = last?.build === '1.1' && last.failed === 0;
  const guideText = finished ? automationLab.finish : last?.build === '1.0' ? automationLab.failed(last.failed) : automationLab.start;
  const t = SUITE[shown];
  const codeLines = [`test('${t.id} ${t.title}', async ({ page }) => {`, ...t.code.map((l) => `  ${l}`), '});'];
  const passCount = status.filter((s) => s === 'pass').length;
  const failCount = status.filter((s) => s === 'fail').length;

  return (
    <>
      <Guide text={guideText} finished={finished} label={finished ? undefined : `Regression suite · build ${build}`} />
      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        <EditorWindow title="checkout.spec.ts — apex-e2e">
          <div className="ed-bar">
            <label className="flex items-center gap-2">
              Build under test
              <select value={build} disabled={running} onChange={(e) => setBuild(e.target.value as Build)} aria-label="Build under test">
                <option value="1.0">1.0 · current</option>
                <option value="1.1">1.1 · fixes</option>
              </select>
            </label>
            <label className="ed-pick">
              <span className="sr-only">Test</span>
              <select value={shown} disabled={running} onChange={(e) => setShown(Number(e.target.value))}>
                {SUITE.map((s, i) => (
                  <option key={s.id} value={i}>
                    {status[i] === 'pass' ? '✓' : status[i] === 'fail' ? '✗' : status[i] === 'run' ? '●' : '○'} {s.id} {s.title}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className={`ed-run ${!running && (!last || (last.build === '1.0' && build === '1.1')) ? 'lab-nudge' : ''}`}
              onClick={run}
              disabled={running}
            >
              {running ? 'Running…' : '▶ Run suite'}
            </button>
          </div>
          <div className="ed-main">
            <div className="ed-tests" role="list" aria-label="Tests in checkout.spec.ts">
              {SUITE.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="listitem"
                  className={i === shown ? 'is-on' : ''}
                  onClick={() => !running && setShown(i)}
                >
                  <span className={`st-${status[i] === 'queued' ? '' : status[i]}`} aria-label={status[i]}>
                    {status[i] === 'pass' ? '✓' : status[i] === 'fail' ? '✗' : status[i] === 'run' ? '●' : '○'}
                  </span>
                  <span>
                    {s.id} {s.title}
                    <small>{s.technique}</small>
                  </span>
                </button>
              ))}
            </div>
            <div className="ed-code" tabIndex={0} role="region" aria-label={`Source of ${t.id}`}>
              {codeLines.map((l, i) => (
                <div key={i} className={line && line.i === i ? (line.fail ? 'is-fail' : 'is-cur') : ''}>
                  <span className="ln">{i + 1}</span>
                  <span>{highlight(l)}</span>
                </div>
              ))}
              {outcomes[shown] && (
                <p className={`mt-2 px-3 font-mono text-[11.5px] ${outcomes[shown]!.pass ? 'text-[#73c991]' : 'text-[#f14c4c]'}`}>
                  {outcomes[shown]!.pass ? '✓ passed' : `✗ expected ${outcomes[shown]!.expected}, received ${outcomes[shown]!.actual}`}
                </p>
              )}
            </div>
          </div>
          <div className="ed-term-h" aria-hidden="true">
            <span>PROBLEMS</span>
            <span>OUTPUT</span>
            <span className="on">TERMINAL</span>
          </div>
          <pre className="ed-term" ref={termRef} tabIndex={0} aria-label="Test runner output">
            {term}
          </pre>
          <div className="ed-foot" role="status">
            <span>⎇ main</span>
            <span>
              {passCount} passed · {failCount} failed · {SUITE.length} tests
            </span>
          </div>
        </EditorWindow>

        <BrowserWindow tab="Checkout · Apex Parts" favicon="#c8102e" url={`staging-${build.replace('.', '-')}.apex-parts.test/checkout`} controlled>
          <ScaledViewport width={680} onScale={onScale}>
            <div className="relative">
              <CheckoutPage ref={pageRef} idPrefix="ax" form={form} result={result} readOnly />
              {cursor && (
                <span className="lab-cursor is-click" style={{ left: cursor.x, top: cursor.y }} aria-hidden="true">
                  <CursorIcon />
                  {/* Keyed by click count so the ripple replays on every click. */}
                  <span key={cursor.click} className="ripple" />
                </span>
              )}
              {failShot && (
                <div className="lab-failshot" aria-hidden="true">
                  <span>test-failed-1.png</span>
                </div>
              )}
            </div>
          </ScaledViewport>
        </BrowserWindow>
      </div>
      <Explain html={automationLab.intro} />
      <RealWork text={automationLab.real} />
    </>
  );
}
