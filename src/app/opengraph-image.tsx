import { ImageResponse } from 'next/og';
import { site } from '@/content/site';
import { hero } from '@/content/home';

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// ImageResponse renders outside the page, so CSS variables cannot reach it.
// These mirror the dark TPH tokens named on each line.
const c = {
  ground: '#141414', // off-token: OG render, mirrors --color-surface-0
  fgHi: '#ffffff', // off-token: OG render, mirrors --color-fg-hi
  muted: '#a1a1aa', // off-token: OG render, mirrors --color-fg-muted
  flame: '#ff5722', // off-token: OG render, mirrors --color-flame
};

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: c.ground,
          color: c.fgHi,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 28, color: c.muted }}>
          {`${site.name} · ${site.role}`}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 96, fontWeight: 600, letterSpacing: -4, lineHeight: 1 }}>
          {hero.title.map((line, i) => (
            <span key={line} style={{ color: i === hero.accentLine ? c.flame : c.fgHi }}>
              {line}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 26, color: c.muted }}>{hero.proof.join('  ·  ')}</div>
      </div>
    ),
    size,
  );
}
