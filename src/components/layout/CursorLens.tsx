'use client';

import { useEffect, useRef } from 'react';

const INTERACTIVE = 'a[href], button, [role="button"], input, textarea, label, summary';

export function CursorLens() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const over = (e.target as Element | null)?.closest(INTERACTIVE);
      el.style.setProperty('--cursor-scale', over ? '0.55' : '0.2');
      el.style.setProperty('--cursor-opacity', '1');
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--cursor-x', `${x}px`);
        el.style.setProperty('--cursor-y', `${y}px`);
      });
    };
    const onLeave = () => el.style.setProperty('--cursor-opacity', '0');

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <div ref={ref} className="cursor-lens" aria-hidden="true" />;
}
