'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { LabId } from '@/content/lab';

type LabContext = {
  active: LabId | null;
  open: (id: LabId) => void;
  setActive: (id: LabId) => void;
  close: () => void;
  done: ReadonlySet<LabId>;
  markDone: (id: LabId) => void;
};

const Ctx = createContext<LabContext | null>(null);
const KEY = 'test-lab-done';

// Which demo is open, and which ones this visitor has finished. Progress is a
// per-browser convenience, so storage failures are ignored.
export function LabProvider({ children }: { children: React.ReactNode }) {
  const [active, setActiveState] = useState<LabId | null>(null);
  const [done, setDone] = useState<Set<LabId>>(new Set());

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? '[]');
      if (Array.isArray(saved)) setDone(new Set(saved));
    } catch {}
  }, []);

  const markDone = useCallback((id: LabId) => {
    setDone((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev).add(id);
      try {
        localStorage.setItem(KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, []);

  const value: LabContext = {
    active,
    open: setActiveState,
    setActive: setActiveState,
    close: () => setActiveState(null),
    done,
    markDone,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLab() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLab must be used inside LabProvider');
  return ctx;
}

/** True while the component is mounted; async demo steps check it before updating. */
export function useAlive() {
  const [ref] = useState(() => ({ current: true }));
  useEffect(() => {
    ref.current = true;
    return () => {
      ref.current = false;
    };
  }, [ref]);
  return ref;
}

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/** Demo pacing; instant under reduced motion. */
export const pause = (ms: number) => new Promise((r) => setTimeout(r, reduced() ? 0 : ms));
