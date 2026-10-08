'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getApp } from '@/content/home';
import { Container } from '@/components/layout/Container';
import { Pill } from '@/components/ui';
import { PerspectiveGrid } from '@/components/PerspectiveGrid';

type Props = { name: string; android?: string; ios?: string };

function detect(): 'android' | 'ios' | 'other' {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return 'android';
  // iPadOS reports itself as a Mac, so check for touch as well.
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
  return 'other';
}

// Sends phones straight to their store; desktops, and phones the app isn't on
// yet, see the available store buttons instead.
export function StoreRedirect({ name, android, ios }: Props) {
  const [device, setDevice] = useState<'android' | 'ios' | 'other' | null>(null);

  useEffect(() => {
    const d = detect();
    setDevice(d);
    const store = d === 'android' ? android : d === 'ios' ? ios : undefined;
    if (store) window.location.replace(store);
  }, [android, ios]);

  const missing = (device === 'android' && !android) || (device === 'ios' && !ios);

  return (
    <section className="relative isolate flex min-h-svh items-center justify-center overflow-hidden">
      <PerspectiveGrid />
      {/* The pointer passes through to the grid except over links. */}
      <Container className="pointer-events-none relative z-10 flex flex-col items-center gap-8 py-32 text-center [&_a]:pointer-events-auto">
        <h1 className="font-display text-statement font-semibold text-fg-hi">{getApp.heading(name)}</h1>
        <p className="max-w-xl text-lead text-fg-muted" role="status">
          {missing ? getApp.only(name, android ? 'Android' : 'iOS') : device === 'other' ? getApp.desktop : getApp.body}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {android && (
            <Pill href={android} variant={device === 'android' || !ios ? 'solid' : 'outline'}>
              {getApp.play}
            </Pill>
          )}
          {ios && (
            <Pill href={ios} variant={device !== 'android' || !android ? 'solid' : 'outline'}>
              {getApp.appStore}
            </Pill>
          )}
        </div>
        <Link href="/#work" className="text-label font-medium text-link hover:text-link-hi">
          {getApp.back}
        </Link>
      </Container>
    </section>
  );
}
