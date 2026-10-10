'use client';

import { useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { testLab, type LabId } from '@/content/lab';
import { pauseScroll, resumeScroll } from '@/lib/scroll';
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

// Radix owns the behaviour: focus trap, Esc, focus return and page scroll lock
// (including touch on iOS). The tab strip is one row that scrolls sideways on
// narrow screens and keeps the active tab in view.
export function LabModal() {
  const { active, setActive, close } = useLab();
  const list = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const card = testLab.cards.find((c) => c.id === active);

  useEffect(() => {
    if (!active) return;
    if (!opener.current) opener.current = document.activeElement as HTMLElement | null;
    pauseScroll();
    return resumeScroll;
  }, [active]);

  useEffect(() => {
    const el = list.current?.querySelector<HTMLElement>('[data-state="active"]');
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' });
  }, [active]);

  return (
    <Dialog.Root open={!!active} onOpenChange={(o) => !o && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="lab-overlay fixed inset-0 z-50" />
        <Dialog.Content
          className="lab-modal fixed z-50 flex flex-col"
          aria-describedby={undefined}
          onCloseAutoFocus={(e) => {
            // Opened from a card or button outside Radix: send focus back there.
            if (opener.current) {
              e.preventDefault();
              opener.current.focus();
              opener.current = null;
            }
          }}
        >
          <Tabs.Root
            value={active ?? undefined}
            onValueChange={(v) => setActive(v as LabId)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex flex-col border-b border-line">
              <div className="flex items-center gap-3 px-4 pt-2 sm:px-5 sm:pt-3">
                <div className="mr-auto flex min-w-0 flex-col">
                  <Dialog.Title className="text-body font-semibold text-fg-hi">{card?.modalTitle}</Dialog.Title>
                  <p className="font-mono text-caption text-fg-muted">{testLab.simulated}</p>
                </div>
                <Dialog.Close
                  aria-label={testLab.close}
                  className="grid size-9 flex-none sm:size-10 place-items-center rounded-full border border-line-hi text-heading leading-none text-fg-hi hover:bg-surface-2"
                >
                  ×
                </Dialog.Close>
              </div>
              <Tabs.List ref={list} aria-label={testLab.tabsLabel} className="lab-tabs mt-2 flex overflow-x-auto px-2 sm:px-3">
                {testLab.cards.map((c) => (
                  <Tabs.Trigger key={c.id} value={c.id} className="lab-tab shrink-0">
                    {c.tab}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </div>
            {testLab.cards.map((c) => {
              const Lab = LABS[c.id];
              return (
                <Tabs.Content
                  key={c.id}
                  value={c.id}
                  className="lab-modal-body flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pt-4 pb-6 focus-visible:outline-none sm:px-5"
                  data-lenis-prevent
                >
                  {/* Inactive tabs unmount, so each demo starts fresh and its timers stop. */}
                  <Lab />
                </Tabs.Content>
              );
            })}
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
