import Link from 'next/link';

export function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-eyebrow font-semibold uppercase text-flame ${className}`}>{children}</p>
  );
}

type PillProps = {
  href: string;
  children: React.ReactNode;
  variant?: 'solid' | 'outline';
  download?: boolean;
  arrow?: boolean;
  /** Full accessible name; must start with the visible label (WCAG 2.5.3). */
  ariaLabel?: string;
};

// Pill-shaped link button. One solid pill per region; the rest are outline.
export function Pill({ href, children, variant = 'outline', download, arrow, ariaLabel }: PillProps) {
  const base =
    'pointer-events-auto inline-flex items-center gap-3 rounded-full px-5 py-3 text-label font-semibold';
  const look =
    variant === 'solid'
      ? 'bg-accent text-accent-on hover:bg-accent-hi'
      : 'border border-line-hi text-fg-hi hover:bg-surface-2';
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <span
          aria-hidden="true"
          className={`grid size-6 place-items-center rounded-full ${variant === 'solid' ? 'bg-accent-on text-accent' : 'bg-fg-hi text-surface-0'}`}
        >
          <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 3.5 10.5 8 6 12.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </>
  );
  const className = `${base} ${look}`;
  if (download || href.endsWith('.pdf')) {
    return (
      <a href={href} download={download} aria-label={ariaLabel} data-press className={className}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} aria-label={ariaLabel} data-press className={className}>
      {content}
    </Link>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-line-hi px-3 py-1.5 text-label text-fg-muted">{children}</span>
  );
}
