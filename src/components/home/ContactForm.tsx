'use client';

import { useState } from 'react';
import { contact } from '@/content/home';
import { site } from '@/content/site';

type Status = 'idle' | 'sending' | 'success' | 'error';
type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;
const t = contact.form;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  const name = String(data.get('name') ?? '').trim();
  const email = String(data.get('email') ?? '').trim();
  const message = String(data.get('message') ?? '').trim();
  if (!name) errors.name = t.required;
  if (!email) errors.email = t.required;
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = t.invalidEmail;
  if (!message) errors.message = t.required;
  return errors;
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    // Without a Formspree ID, hand the message to the visitor's mail client.
    if (!FORMSPREE_ID) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${data.get('name')}`);
      const body = encodeURIComponent(`${data.get('message')}\n\n${data.get('name')} <${data.get('email')}>`);
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  const fieldClass =
    'field w-full rounded border border-line-hi bg-surface-0 px-3 py-2.5 text-body text-fg placeholder:text-fg-subtle';

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5" aria-describedby="form-status">
      {(['name', 'email'] as const).map((field) => (
        <div key={field} className="flex flex-col gap-1.5">
          <label htmlFor={field} className="text-label font-medium text-fg-hi">
            {t[field]}
          </label>
          <input
            id={field}
            name={field}
            type={field === 'email' ? 'email' : 'text'}
            autoComplete={field}
            aria-invalid={errors[field] ? true : undefined}
            aria-describedby={errors[field] ? `${field}-error` : undefined}
            className={fieldClass}
          />
          {errors[field] && (
            <p id={`${field}-error`} className="text-label text-error">
              {errors[field]}
            </p>
          )}
        </div>
      ))}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-label font-medium text-fg-hi">
          {t.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={`${fieldClass} resize-y`}
        />
        {errors.message && (
          <p id="message-error" className="text-label text-error">
            {errors.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          data-press
          className="rounded bg-accent px-5 py-3 text-label font-medium text-accent-on hover:bg-accent-hi disabled:opacity-60"
        >
          {status === 'sending' ? t.sending : t.submit}
        </button>
        <p id="form-status" role="status" className="text-label">
          {status === 'success' && <span className="text-success">✓ {t.success}</span>}
          {status === 'error' && <span className="text-error">{t.error}</span>}
        </p>
      </div>
    </form>
  );
}
