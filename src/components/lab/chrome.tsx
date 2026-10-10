// Shared pieces of the Test Lab: the coach strip, explanation callouts and
// window frames that imitate a desktop browser and a code editor.

export function Html({ html, className, as: Tag = 'span' }: { html: string; className?: string; as?: 'span' | 'p' | 'div' }) {
  // Lab copy is authored in src/content/lab.ts and may contain <b> and <span>.
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Guide({
  step,
  total,
  text,
  finished,
  label,
}: {
  step?: number;
  total?: number;
  text: string;
  finished?: boolean;
  label?: string;
}) {
  return (
    <div className={`lab-guide ${finished ? 'is-done' : ''}`} role="status" aria-live="polite">
      <span className="lab-guide-num" aria-hidden="true">
        {finished ? '✓' : (step ?? '▸')}
      </span>
      <span className="lab-guide-step">
        {label ?? (finished ? 'Complete' : total ? `Step ${step} of ${total}` : 'Try this')}
        {total ? (
          <span className="lab-dots" aria-hidden="true">
            {Array.from({ length: total }, (_, i) => (
              <i key={i} className={finished || i < (step ?? 0) ? 'on' : ''} />
            ))}
          </span>
        ) : null}
      </span>
      <Html html={text} className="lab-guide-say" />
    </div>
  );
}

export function Explain({ html, tone = 'info' }: { html: string; tone?: 'info' | 'good' | 'bad' }) {
  return <Html as="p" html={html} className={`lab-explain is-${tone}`} />;
}

export function RealWork({ text }: { text: string }) {
  return <p className="lab-real">{text}</p>;
}

function Lights() {
  return (
    <span className="win-lights" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

export function BrowserWindow({
  tab,
  favicon,
  url,
  extraTabs = [],
  controlled,
  tools,
  children,
  className = '',
}: {
  tab: string;
  favicon: string;
  url: string;
  extraTabs?: [string, string][];
  controlled?: boolean;
  tools?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const [host, ...path] = url.split('/');
  return (
    <div className={`win ${className}`}>
      <div className="win-top">
        <Lights />
        <div className="win-tab">
          <span className="win-fav" style={{ background: favicon }} aria-hidden="true" />
          <span className="win-tt">{tab}</span>
          <span className="win-x" aria-hidden="true">×</span>
        </div>
        {extraTabs.map(([t, c]) => (
          <div key={t} className="win-tab is-off" aria-hidden="true">
            <span className="win-fav" style={{ background: c }} />
            <span className="win-tt">{t}</span>
          </div>
        ))}
      </div>
      <div className="win-bar">
        <span className="win-navs" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" /></svg>
          <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
          <svg viewBox="0 0 24 24"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" /></svg>
        </span>
        <span className="win-omni">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
          <span className="win-url">
            <b>{host}</b>
            {path.length ? `/${path.join('/')}` : ''}
          </span>
        </span>
        <span className="win-tools">
          {tools}
          <span className="win-avatar" aria-hidden="true">A</span>
        </span>
      </div>
      {controlled && (
        <div className="win-infobar">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>
          This browser is being controlled by automated test software.
        </div>
      )}
      <div className="win-body">{children}</div>
    </div>
  );
}

export function EditorWindow({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`ed ${className}`}>
      <div className="ed-top">
        <Lights />
        <span className="ed-title">{title}</span>
      </div>
      {children}
    </div>
  );
}

export function Pill({ tone, children }: { tone?: 'pass' | 'fail' | 'warn'; children: React.ReactNode }) {
  return <span className={`lab-pill ${tone ? `is-${tone}` : ''}`}>{children}</span>;
}
