'use client';

import { useEffect, useRef } from 'react';
import { testLab, type LabId } from '@/content/lab';
import { lockScroll, unlockScroll } from '@/lib/scroll';
import { useLab } from './LabProvider';
import { ApiLab } from './labs/ApiLab';
import { FunctionalLab } from './labs/FunctionalLab';
import { BoundaryLab } from './labs/BoundaryLab';
import { AutomationLab } from './labs/AutomationLab';
import { A11yLab } from './labs/A11yLab';

const LABS: Record<LabId, () => React.JSX.Element> = {
  api: ApiLab,
  functional: FunctionalLab,
  boundary: BoundaryLab,
  automation: AutomationLab,
  a11y: A11yLab,
};

// Native <dialog> opened with showModal(): focus is trapped, Esc closes it and
// the page behind is inert. Focus returns to whatever opened it.
export function LabModal() {
  const { active, setActive, close } = useLab();
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (active && !d.open) {
      opener.current = document.activeElement as HTMLElement | null;
      d.showModal();
      lockScroll();
    } else if (!active && d.open) {
      d.close();
    }
  }, [active]);

  // Never leave the page frozen if the modal unmounts while open.
  useEffect(() => unlockScroll, []);

  const onClose = () => {
    unlockScroll();
    close();
    opener.current?.focus();
  };

  const ids = testLab.cards.map((c) => c.id);
  const card = testLab.cards.find((c) => c.id === active);
  const Lab = active ? LABS[active] : null;

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const n = e.key === 'ArrowRight' ? (i + 1) % ids.length : e.key === 'ArrowLeft' ? (i - 1 + ids.length) % ids.length : -1;
    if (n < 0) return;
    e.preventDefault();
    setActive(ids[n]);
    tabs.current[n]?.focus();
  };

  return (
    <dialog
      ref={ref}
      className="lab-modal"
      aria-labelledby="lab-modal-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-line py-3 pr-4 pl-5">
        <div className="mr-auto flex flex-col">
          <h2 id="lab-modal-title" className="text-body font-semibold text-fg-hi">
            {card?.modalTitle}
          </h2>
          <p className="font-mono text-caption text-fg-muted">{testLab.simulated}</p>
        </div>
        <div
          role="tablist"
          aria-label={testLab.tabsLabel}
          className="order-3 flex w-full max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-surface-1 p-1 md:order-2 md:w-auto"
        >
          {testLab.cards.map((c, i) => (
            <button
              key={c.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`lab-tab-${c.id}`}
              aria-selected={active === c.id}
              aria-controls="lab-panel"
              tabIndex={active === c.id ? 0 : -1}
              onClick={() => setActive(c.id)}
              onKeyDown={(e) => onTabKey(e, i)}
              className={`flex-none rounded-full px-3 py-1.5 text-label font-semibold ${
                active === c.id ? 'bg-fg-hi text-surface-0' : 'text-fg-muted hover:text-fg-hi'
              }`}
            >
              {c.tab}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label={testLab.close}
          className="order-2 grid size-10 flex-none place-items-center rounded-full border border-line-hi text-heading leading-none text-fg-hi hover:bg-surface-2 md:order-3"
        >
          ×
        </button>
      </div>
      <div
        id="lab-panel"
        role="tabpanel"
        aria-labelledby={active ? `lab-tab-${active}` : undefined}
        className="lab-modal-body flex flex-col gap-4 overflow-y-auto px-4 pt-4 pb-6 sm:px-5"
        data-lenis-prevent
      >
        {/* Keyed so switching tabs starts each demo fresh and stops its timers. */}
        {Lab && <Lab key={active} />}
      </div>
    </dialog>
  );
}
