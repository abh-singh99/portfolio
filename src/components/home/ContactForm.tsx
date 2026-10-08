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

  // Editorial underline fields: small uppercase label, large text on one line.
  const fieldClass =
    'field-line w-full border-0 border-b border-line-hi bg-transparent px-0 pt-2 pb-3 font-display text-heading text-fg-hi placeholder:text-fg-subtle';
  const labelClass = 'text-eyebrow font-semibold uppercase text-fg-muted';

  const error = (field: keyof Errors) =>
    errors[field] && (
      <p id={`${field}-error`} className="text-label text-error">
        {errors[field]}
      </p>
    );

  return (
    <form noValidate onSubmit={onSubmit} className="flex h-full flex-col gap-10" aria-describedby="form-status">
      <div className="flex flex-col gap-10">
        {(['name', 'email'] as const).map((field) => (
          <div key={field} className="flex flex-col gap-2">
            <label htmlFor={field} className={labelClass}>
              {t[field]}
            </label>
            <input
              id={field}
              name={field}
              type={field === 'email' ? 'email' : 'text'}
              autoComplete={field}
              placeholder={t.placeholders[field]}
              aria-invalid={errors[field] ? true : undefined}
              aria-describedby={errors[field] ? `${field}-error` : undefined}
              className={fieldClass}
            />
            {error(field)}
          </div>
        ))}
      </div>

      {/* Grows so the form ends level with the details column beside it. */}
      <div className="flex flex-1 flex-col gap-2">
        <label htmlFor="message" className={labelClass}>
          {t.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder={t.placeholders.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={`${fieldClass} min-h-32 flex-1 resize-none`}
        />
        {error('message')}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p id="form-status" role="status" className="text-label text-fg-muted">
          {status === 'success' && <span className="text-success">✓ {t.success}</span>}
          {status === 'error' && <span className="text-error">{t.error}</span>}
        </p>
        <button
          type="submit"
          disabled={status === 'sending'}
          data-press
          className="ml-auto inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-label font-semibold text-accent-on hover:bg-accent-hi disabled:opacity-60"
        >
          {status === 'sending' ? t.sending : t.submit}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );
}
