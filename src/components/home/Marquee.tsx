import { marquee } from '@/content/home';

export function Marquee() {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {marquee.map((w) => (
        <li key={w} className="flex items-center px-6 font-display text-marquee font-bold text-fg-subtle sm:px-8">
          {w}
          <span aria-hidden="true" className="ml-12 text-flame sm:ml-16">
            ✳
          </span>
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
