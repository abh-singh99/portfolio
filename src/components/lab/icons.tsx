// Inline icons for the Test Lab cards and tabs. Decorative: always aria-hidden.
const base = { width: 22, height: 22, viewBox: '0 0 24 24', 'aria-hidden': true } as const;
const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const LabIcon = {
  api: () => (
    <svg {...base} {...line}><path d="M8 7 3 12l5 5M16 7l5 5-5 5M13.5 4l-3 16" /></svg>
  ),
  functional: () => (
    <svg {...base} {...line}><rect x="7" y="8" width="10" height="12" rx="5" /><path d="M12 8V5M9 5l1.5 2M15 5l-1.5 2M3 13h4M17 13h4M4 19l3-2M20 19l-3-2M4 7l3 2M20 7l-3 2" /></svg>
  ),
  boundary: () => (
    <svg {...base} {...line}><path d="M3 12h18M7 8v8M17 8v8" /><circle cx="7" cy="12" r="1.5" fill="currentColor" /><circle cx="17" cy="12" r="1.5" fill="currentColor" /></svg>
  ),
  automation: () => (
    <svg {...base} fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
  ),
  a11y: () => (
    <svg {...base} {...line}><circle cx="12" cy="4.5" r="1.8" /><path d="M5 8.5l7 1.5 7-1.5M12 10v5l-3 6M12 15l3 6" /></svg>
  ),
};

export const CursorIcon = () => (
  <svg viewBox="0 0 18 22" aria-hidden="true">
    <path d="M1 1v17l4.5-4.2 3 6.7 3-1.4-3-6.6H15Z" fill="#111" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);
