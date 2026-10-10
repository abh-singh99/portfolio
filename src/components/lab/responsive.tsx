'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/** True when the query matches; false during SSR and the first paint. */
export function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}
export const WIDE = '(min-width: 64rem)';

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

// Shows a read-only page at a fixed desktop width, scaled down to fit narrow
// screens, like a remote browser preview. Interactive pages never use this:
// they reflow instead. `onScale` reports the factor for pointer maths.
export function ScaledViewport({
  width,
  children,
  onScale,
}: {
  width: number;
  children: React.ReactNode;
  onScale?: (s: number) => void;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>();

  useIso(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const measure = () => {
      const s = Math.min(1, o.clientWidth / width);
      setScale(s);
      setHeight(i.offsetHeight * s);
      onScale?.(s);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, [width, onScale]);

  const fits = scale >= 1;
  return (
    <div ref={outer} style={{ height: fits ? undefined : height, overflow: 'hidden' }}>
      <div
        ref={inner}
        style={fits ? undefined : { width, transform: `scale(${scale})`, transformOrigin: '0 0' }}
      >
        {children}
      </div>
    </div>
  );
}
