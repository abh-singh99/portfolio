// Background plane of tiles tilted in 3D. Hover is pure CSS (see
// .perspective-grid-tile), so this stays a server component.
export function PerspectiveGrid({ size = 40 }: { size?: number }) {
  return (
    <div aria-hidden="true" className="perspective-grid absolute inset-0 z-0">
      <div className="perspective-grid-plane" style={{ '--grid-n': size } as React.CSSProperties}>
        {Array.from({ length: size * size }, (_, i) => (
          <div key={i} className="perspective-grid-tile" />
        ))}
      </div>
    </div>
  );
}
