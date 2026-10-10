'use client';

import { forwardRef } from 'react';
import { FIELDS, UNIT_PENCE, VAT_PCT, money, type CheckoutForm, type Field, type Submission } from '@/lib/lab/checkout';

const LABELS: Record<Field, string> = {
  name: 'Full name',
  email: 'Email',
  password: 'Create a password',
  qty: 'Quantity',
  coupon: 'Discount code (optional)',
};
const TYPES: Partial<Record<Field, string>> = { password: 'password' };

type Props = {
  idPrefix: string;
  form: CheckoutForm;
  result: Submission | null;
  onChange?: (f: CheckoutForm) => void;
  onSubmit?: () => void;
  onFillValid?: () => void;
  /** When driven by a test, inputs are read-only and highlighted by the cursor. */
  readOnly?: boolean;
};

// The fictional Apex Parts checkout. Presentational: the build logic lives in
// lib/lab/checkout.ts and the demos decide what happens on submit.
export const CheckoutPage = forwardRef<HTMLDivElement, Props>(function CheckoutPage(
  { idPrefix, form, result, onChange, onSubmit, onFillValid, readOnly },
  ref,
) {
  const qty = Number(form.qty);
  const preview = result?.order;
  const unitsTotal = Number.isFinite(qty) && qty >= 0 ? qty * UNIT_PENCE : 0;
  return (
    <div className="shop" ref={ref}>
      <div className="shop-nav">
        <span className="shop-logo">
          APEX<i>/</i>PARTS
        </span>
        <nav aria-hidden="true">
          <span>Brakes</span>
          <span>Suspension</span>
          <span>Exhaust</span>
        </nav>
      </div>
      <p className="shop-crumbs">Cart / Checkout</p>
      {result && (
        <div className={`shop-confirm ${result.ok ? '' : 'is-bad'}`} role="status" data-target="confirm">
          {result.ok ? (
            <>
              <b>Order placed.</b> Thanks, {form.name.trim()}
              {result.unencoded && <span className="live">rendered as HTML</span>}.
              Total charged <b data-testid="total">{money(result.order!.total)}</b>.
            </>
          ) : (
            <>
              <b>Order not placed.</b> {Object.keys(result.errors).length} field
              {Object.keys(result.errors).length === 1 ? ' needs' : 's need'} attention.
            </>
          )}
        </div>
      )}
      <form
        className="shop-main"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.();
        }}
      >
        <div>
          <h3>Checkout</h3>
          <div className="shop-grid">
            {FIELDS.map((f) => (
              <div key={f} className={`shop-field ${f === 'name' || f === 'email' ? 'full' : ''}`}>
                <label htmlFor={`${idPrefix}-${f}`}>{LABELS[f]}</label>
                <input
                  id={`${idPrefix}-${f}`}
                  data-target={f}
                  type={TYPES[f] ?? 'text'}
                  inputMode={f === 'qty' ? 'numeric' : undefined}
                  autoComplete="off"
                  value={form[f]}
                  readOnly={readOnly}
                  aria-invalid={result?.errors[f] ? 'true' : 'false'}
                  aria-describedby={`${idPrefix}-${f}-err`}
                  onChange={(e) => onChange?.({ ...form, [f]: e.target.value })}
                />
                <span className="shop-err" id={`${idPrefix}-${f}-err`}>
                  {result?.errors[f] ?? ''}
                </span>
              </div>
            ))}
          </div>
          <div className="shop-actions">
            <button type="submit" className="shop-cta" data-target="submit">
              Place order
            </button>
            {onFillValid && (
              <button type="button" className="shop-cta is-ghost" onClick={onFillValid}>
                Fill valid example
              </button>
            )}
          </div>
        </div>
        <aside className="shop-sum" aria-label="Order summary">
          <h5>Order summary</h5>
          <div className="shop-item">
            <span className="shop-thumb" aria-hidden="true" />
            <span>
              <b>Carbon ceramic brake kit</b>
              <br />
              {money(UNIT_PENCE)} each
            </span>
          </div>
          <div className="shop-row">
            <span>Subtotal</span>
            <span>{money(preview?.subtotal ?? unitsTotal)}</span>
          </div>
          <div className="shop-row">
            <span>Discount</span>
            <span>{preview?.discount ? `−${money(preview.discount)}` : '£0.00'}</span>
          </div>
          <div className="shop-row">
            <span>VAT {VAT_PCT}%</span>
            <span>{preview ? money(preview.vat) : '—'}</span>
          </div>
          <div className="shop-row total">
            <span>Total</span>
            <span>{preview ? money(preview.total) : '—'}</span>
          </div>
        </aside>
      </form>
    </div>
  );
});
