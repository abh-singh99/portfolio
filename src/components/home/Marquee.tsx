import { marquee } from '@/content/home';

export function Marquee() {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {marquee.map((w) => (
        <li key={w} className="flex items-center px-6 font-display text-marquee font-bold text-fg-subtle sm:px-8">
          {w}
          {/* Drawn, not a text glyph: iOS renders ✳ as a green emoji. */}
          <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-12 size-[0.6em] shrink-0 text-flame sm:ml-16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
            <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
          </svg>
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Tools I use" className="marquee overflow-hidden border-y border-line bg-surface-1 py-8 sm:py-10">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
