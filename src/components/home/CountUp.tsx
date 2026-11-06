'use client';

import { useEffect, useRef, useState } from 'react';

// Counts from 0 to `value` the first time it scrolls into view. The final
// number is rendered on the server and kept for screen readers, so the count
// is decoration only; reduced motion skips it.
export function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    setShown(0);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1400);
          setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  const final = `${value.toLocaleString('en-IN')}${suffix}`;
  return (
    <span ref={ref}>
      <span className="sr-only">{final}</span>
      <span aria-hidden="true" className="tabular-nums">
        {shown.toLocaleString('en-IN')}
        {suffix}
      </span>
    </span>
  );
}
