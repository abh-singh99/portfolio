'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { work } from '@/content/home';
import type { Project } from '@/content/projects';

const badge =
  'project-link-badge pointer-events-none absolute right-4 bottom-4 z-10 rounded-full bg-surface-0/85 px-3 py-1.5 text-label font-semibold text-fg-hi backdrop-blur';

// Makes a project's screens clickable: a website opens in a new tab, an app goes
// to its /get page, and a product that isn't public shows a short note instead.
export function ProjectLink({ p, children }: { p: Project; children: React.ReactNode }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!shown) return;
    const t = setTimeout(() => setShown(false), 3500);
    return () => clearTimeout(t);
  }, [shown]);

  const link = p.link;
  const className = 'project-link group relative block rounded-[calc(var(--radius-card)+8px)]';

  if (link?.kind === 'site') {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noreferrer"
        aria-label={`${work.visitLabel}: ${p.name}, ${link.label} (${work.newTab})`}
        className={className}
      >
        {children}
        <span aria-hidden="true" className={badge}>
          {work.visitLabel} ↗
        </span>
      </a>
    );
  }

  if (link?.kind === 'app' && (link.android || link.ios)) {
    return (
      <Link href={`/get/${p.slug}`} aria-label={`${work.appLabel}: ${p.name}`} className={className}>
        {children}
        <span aria-hidden="true" className={badge}>
          {work.appLabel} ↗
        </span>
      </Link>
    );
  }

  if (link?.kind === 'soon') {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setShown(true)}
          aria-label={`${p.name}: ${work.soonLabel}`}
          aria-describedby={`${p.slug}-soon`}
          className={`${className} w-full cursor-pointer text-left`}
        >
          {children}
          <span aria-hidden="true" className={badge}>
            {work.soonLabel}
          </span>
        </button>
        <p
          id={`${p.slug}-soon`}
          role="status"
          className={`absolute inset-x-4 bottom-16 z-20 mx-auto w-fit max-w-[calc(100%-2rem)] rounded-card border border-line-hi bg-surface-1 px-4 py-3 text-center text-body text-fg-hi shadow-lg transition-opacity duration-200 ${shown ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        >
          {shown ? link.note : ''}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
