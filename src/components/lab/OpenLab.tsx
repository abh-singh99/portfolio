'use client';

import type { LabId } from '@/content/lab';
import { useLab } from './LabProvider';

// A pill that opens one Test Lab demo, for use outside the lab section.
export function OpenLab({ lab, label }: { lab: LabId; label: string }) {
  const { open } = useLab();
  return (
    <button
      type="button"
      onClick={() => open(lab)}
      data-press
      className="inline-flex items-center gap-3 rounded-full bg-accent px-5 py-3 text-label font-semibold text-accent-on hover:bg-accent-hi"
    >
      {label}
      <span aria-hidden="true">→</span>
    </button>
  );
}
