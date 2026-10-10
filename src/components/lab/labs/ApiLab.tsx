'use client';

import { useMemo, useState } from 'react';
import { apiLab } from '@/content/lab';
import {
  PRESETS,
  STATUS_TEXT,
  assertResponse,
  newState,
  route,
  testScript,
  type ApiResponse,
  type Assertion,
  type Expectation,
  type Method,
} from '@/lib/lab/api';
import { BrowserWindow, Explain, Guide, RealWork } from '../chrome';
import { pause, useAlive, useLab } from '../LabProvider';

type Run = { id: string; res: ApiResponse; checks: Assertion[] };
const statusClass = (s: number, failed: boolean) => (failed ? 'c-bad' : s < 300 ? 'c-ok' : 'c-warn');

export function ApiLab() {
  const alive = useAlive();
  const { markDone } = useLab();
  const [state] = useState(newState);
  const [presetId, setPresetId] = useState('create');
  const preset = PRESETS.find((p) => p.id === presetId)!;
  const [method, setMethod] = useState<Method>(preset.method);
  const [path, setPath] = useState(preset.path);
  const [headers, setHeaders] = useState(preset.headers);
  const [body, setBody] = useState(preset.body);
  const [exp, setExp] = useState<Expectation>(preset.exp);
  const [reqTab, setReqTab] = useState<'headers' | 'body' | 'tests'>('body');
  const [resTab, setResTab] = useState<'body' | 'tests' | 'headers'>('body');
  const [last, setLast] = useState<Run | null>(null);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(1);
  const [explain, setExplain] = useState<{ html: string; tone: 'info' | 'good' | 'bad' }>({ html: apiLab.explain.intro, tone: 'info' });
  const [collection, setCollection] = useState<Run[] | null>(null);

  const load = (id: string) => {
    const p = PRESETS.find((x) => x.id === id)!;
    setPresetId(id);
    setMethod(p.method);
    setPath(p.path);
    setHeaders(p.headers);
    setBody(p.body);
    setExp(p.exp);
    setLast(null);
    setCollection(null);
    setReqTab(p.method === 'GET' ? 'tests' : 'body');
  };

  const send = async () => {
    setBusy(true);
    setCollection(null);
    const res = route({ method, path, headers, body }, state);
    await pause(Math.min(res.ms, 450));
    if (!alive.current) return;
    const checks = assertResponse(res, exp);
    const failed = checks.some((c) => !c.pass);
    setLast({ id: presetId, res, checks });
    setResTab(failed ? 'tests' : 'body');
    setBusy(false);
    if (step === 1 && presetId === 'create' && !failed) {
      setExplain({ html: apiLab.explain.create, tone: 'good' });
      setStep(2);
    } else if (step === 2 && presetId === 'unknown' && failed) {
      setExplain({ html: apiLab.explain.unknown, tone: 'bad' });
      setStep(3);
    }
  };

  const runCollection = async () => {
    setBusy(true);
    setCollection([]);
    const s = newState();
    const runs: Run[] = [];
    for (const p of PRESETS) {
      const res = route(p, s);
      await pause(Math.min(res.ms, 260));
      if (!alive.current) return;
      runs.push({ id: p.id, res, checks: assertResponse(res, p.exp) });
      setCollection([...runs]);
    }
    setBusy(false);
    setStep(4);
    setExplain({ html: `${apiLab.explain.unknown} ${apiLab.explain.slow}`, tone: 'bad' });
    markDone('api');
  };

  const script = useMemo(() => testScript(exp), [exp]);
  const failedCount = last ? last.checks.filter((c) => !c.pass).length : 0;
  const folders = [...new Set(PRESETS.map((p) => p.folder))];
  const collFails = collection?.filter((r) => r.checks.some((c) => !c.pass)).length ?? 0;

  return (
    <>
      <Guide
        step={Math.min(step, 3)}
        total={3}
        finished={step === 4}
        text={step === 4 ? apiLab.finish : apiLab.steps[step - 1]}
      />
      <BrowserWindow
        tab="Apex Parts API · QA workspace"
        favicon="#ff6c37"
        url="api-client.app/workspace/apex-qa/collection"
        extraTabs={[['API docs · Apex Parts', '#0052cc']]}
      >
        <div className="api">
          <aside className="api-side" aria-label="Collection">
            <div className="api-side-h">
              <span>Apex API</span>
              <button type="button" className={`api-run ${step === 3 ? 'lab-nudge' : ''}`} onClick={runCollection} disabled={busy}>
                Run collection
              </button>
            </div>
            {folders.map((f) => (
              <div key={f}>
                <p className="api-folder">▾ {f}</p>
                {PRESETS.filter((p) => p.folder === f).map((p) => {
                  const r = collection?.find((x) => x.id === p.id);
                  const bad = r?.checks.some((c) => !c.pass);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => load(p.id)}
                      className={`${p.id === presetId ? 'is-on' : ''} ${step === 2 && p.id === 'unknown' && presetId !== 'unknown' ? 'is-hint' : ''}`}
                    >
                      <span className={`api-m ${p.method}`}>{p.method}</span>
                      {p.name}
                      {r && <span className={`res ${bad ? 'c-bad' : 'c-ok'}`}>{bad ? 'FAIL' : 'PASS'}</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </aside>

          <section className="api-main" aria-label="Request">
            <div className="api-reqtab">
              <span>
                <b className={`api-m ${method}`} style={{ width: 'auto' }}>{method}</b> {preset.name}
              </span>
            </div>
            <div className="api-line">
              <div className="api-line-grp">
                <select aria-label="Method" value={method} onChange={(e) => setMethod(e.target.value as Method)} className={`api-method ${method}`}>
                  {(['GET', 'POST', 'PUT', 'DELETE'] as const).map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <input aria-label="Request URL" value={path} onChange={(e) => setPath(e.target.value)} spellCheck={false} />
              </div>
              <button type="button" className={`api-send ${step === 1 || (step === 2 && presetId === 'unknown') ? 'lab-nudge' : ''}`} onClick={send} disabled={busy}>
                {busy ? 'Sending…' : 'Send'}
              </button>
            </div>
            <div className="api-sub" role="tablist" aria-label="Request details">
              {(['headers', 'body', 'tests'] as const).map((t) => (
                <button key={t} type="button" role="tab" aria-selected={reqTab === t} onClick={() => setReqTab(t)}>
                  {t === 'headers' ? 'Headers' : t === 'body' ? 'Body' : (
                    <>
                      Tests <span className="n">●</span>
                    </>
                  )}
                </button>
              ))}
            </div>
            <div className="api-pane">
              {reqTab === 'headers' && <textarea aria-label="Request headers" value={headers} onChange={(e) => setHeaders(e.target.value)} spellCheck={false} />}
              {reqTab === 'body' && (
                <textarea aria-label="Request body" value={body} onChange={(e) => setBody(e.target.value)} spellCheck={false} placeholder="This request has no body" />
              )}
              {reqTab === 'tests' && (
                <>
                  <div className="api-asserts">
                    <label>
                      Expected status
                      <input inputMode="numeric" value={exp.status} onChange={(e) => setExp({ ...exp, status: Number(e.target.value) || 0 })} />
                    </label>
                    <label>
                      Max time (ms)
                      <input inputMode="numeric" value={exp.maxMs} onChange={(e) => setExp({ ...exp, maxMs: Number(e.target.value) || 0 })} />
                    </label>
                    <label>
                      Body keys
                      <input
                        value={exp.keys.join(', ')}
                        onChange={(e) => setExp({ ...exp, keys: e.target.value.split(',').map((k) => k.trim()).filter(Boolean) })}
                      />
                    </label>
                  </div>
                  <pre className="api-code" tabIndex={0} aria-label="Generated test script">{script}</pre>
                </>
              )}
            </div>

            <div className="api-resp">
              {collection ? (
                <>
                  <div className="api-resp-h">
                    <div className="api-sub">
                      <span className="py-[7px] text-[#202124] shadow-[inset_0_-2px_0_#ff5722]">Collection run</span>
                    </div>
                    <div className="api-meta" role="status">
                      <span>Requests: <b>{collection.length}/{PRESETS.length}</b></span>
                      <span>Passed: <b className="c-ok">{collection.length - collFails}</b></span>
                      <span>Failed: <b className="c-bad">{collFails}</b></span>
                    </div>
                  </div>
                  <ul className="api-runner">
                    {collection.map((r) => {
                      const p = PRESETS.find((x) => x.id === r.id)!;
                      const bad = r.checks.filter((c) => !c.pass);
                      return (
                        <li key={r.id}>
                          <span>
                            {p.name}
                            <small>{p.method} {p.path}</small>
                          </span>
                          <span className={`font-mono ${statusClass(r.res.status, false)}`}>{r.res.status}</span>
                          <span className="font-mono">{r.res.ms} ms</span>
                          <span className={`api-badge ${bad.length ? 'f' : 'p'}`}>{bad.length ? 'FAIL' : 'PASS'}</span>
                          {bad.length > 0 && <span className="why">{bad.map((b) => `${b.label} (${b.detail})`).join(' · ')}</span>}
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : last ? (
                <>
                  <div className="api-resp-h">
                    <div className="api-sub" role="tablist" aria-label="Response">
                      {(['body', 'headers', 'tests'] as const).map((t) => (
                        <button key={t} type="button" role="tab" aria-selected={resTab === t} onClick={() => setResTab(t)}>
                          {t === 'body' ? 'Body' : t === 'headers' ? `Headers (${Object.keys(last.res.headers).length})` : (
                            <>
                              Test Results <span className={failedCount ? 'c-bad' : 'n'}>({last.checks.length - failedCount}/{last.checks.length})</span>
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="api-meta" role="status">
                      <span>Status: <b className={statusClass(last.res.status, failedCount > 0)}>{last.res.status} {STATUS_TEXT[last.res.status]}</b></span>
                      <span>Time: <b className={last.res.ms < exp.maxMs ? 'c-ok' : 'c-bad'}>{last.res.ms} ms</b></span>
                      <span>Size: <b>{last.res.body.length + 180} B</b></span>
                    </div>
                  </div>
                  {resTab === 'body' && <pre tabIndex={0} aria-label="Response body">{last.res.body || '(empty body)'}</pre>}
                  {resTab === 'headers' && (
                    <pre tabIndex={0} aria-label="Response headers">
                      {Object.entries(last.res.headers).map(([k, v]) => `${k}: ${v}`).join('\n') || '(no headers)'}
                    </pre>
                  )}
                  {resTab === 'tests' && (
                    <ul className="api-results">
                      {last.checks.map((c) => (
                        <li key={c.label}>
                          <span className={`api-badge ${c.pass ? 'p' : 'f'}`}>{c.pass ? 'PASS' : 'FAIL'}</span>
                          <span>
                            {c.label} <span className="c-warn">({c.detail})</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <p className="api-empty">{busy ? 'Running collection…' : 'Click Send to get a response'}</p>
              )}
            </div>
          </section>
        </div>
      </BrowserWindow>
      <Explain html={explain.html} tone={explain.tone} />
      <RealWork text={apiLab.real} />
    </>
  );
}
