// Fixed ember glow behind the whole site; see .ambient in globals.css.
export function AmbientGlow() {
  return (
    <div aria-hidden="true" className="ambient">
      <div className="ambient-beat">
        <div className="ambient-blob ambient-blob-1" />
        <div className="ambient-blob ambient-blob-2" />
        <div className="ambient-blob ambient-blob-3" />
        <div className="ambient-blob ambient-blob-4" />
      </div>
      <div className="ambient-grid" />
    </div>
  );
}
