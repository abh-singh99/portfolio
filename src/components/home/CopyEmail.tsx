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
      aria-label={copied ? `${copiedLabel}: ${email}` : `${label} email address`}
      data-press
      className="inline-flex min-h-8 items-center rounded-full border border-line-hi px-3 text-eyebrow font-semibold uppercase text-fg-muted hover:bg-surface-2 hover:text-fg-hi"
    >
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
