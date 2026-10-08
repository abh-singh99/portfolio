'use client';

import { useState } from 'react';

export function CopyEmail({ email, label, copiedLabel }: { email: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      data-press
      className="rounded border border-line-hi px-3 py-1.5 text-label font-medium text-fg hover:bg-surface-2"
    >
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
