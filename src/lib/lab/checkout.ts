// The Test Lab shop's checkout runs on two builds of the same submit logic.
// Build 1.0 carries six planted defects; build 1.1 follows the requirements.
// The functional demo reports a defect whenever the builds disagree, and the
// regression suite runs real checks against either build, so every result is
// computed, not scripted.

export type Build = '1.0' | '1.1';
export type CheckoutForm = { name: string; email: string; password: string; qty: string; coupon: string };
export type Field = keyof CheckoutForm;
export const FIELDS: Field[] = ['name', 'email', 'password', 'qty', 'coupon'];

export const UNIT_PENCE = 12000; // £120.00
export const VAT_PCT = 20;
export const COUPON = 'SAVE10';
export const COUPON_PCT = 10;

export const VALID: CheckoutForm = { name: 'Priya Sharma', email: 'priya@example.com', password: 'Passw0rd!', qty: '2', coupon: '' };
export const EMPTY: CheckoutForm = { name: '', email: '', password: '', qty: '', coupon: '' };

export type Order = { subtotal: number; discount: number; vat: number; total: number };
export type Submission = {
  ok: boolean;
  valid: Record<Field, boolean>;
  errors: Partial<Record<Field, string>>;
  order: Order | null;
  /** Build 1.0 echoes the name on the confirmation without output encoding. */
  unencoded: boolean;
};

const isInt = (s: string) => /^\d+$/.test(s.trim());

export function price(qty: number, pct: number, build: Build): Order {
  const subtotal = qty * UNIT_PENCE;
  const discount = Math.round((subtotal * pct) / 100);
  // 1.0 charges VAT on the full subtotal instead of the discounted amount.
  const vat = Math.round(((build === '1.0' ? subtotal : subtotal - discount) * VAT_PCT) / 100);
  return { subtotal, discount, vat, total: subtotal - discount + vat };
}

export function submit(f: CheckoutForm, build: Build): Submission {
  const buggy = build === '1.0';
  const errors: Submission['errors'] = {};
  const name = f.name.trim();
  const email = f.email.trim();
  const pw = f.password.length;
  const qtyS = f.qty.trim();
  const qty = Number(qtyS);
  const code = f.coupon.trim();

  const valid: Submission['valid'] = {
    name: name.length > 0,
    // 1.0 accepts an address with no domain extension.
    email: buggy ? /^\S+@\S+$/.test(email) : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email),
    // 1.0 uses > where the requirement says at least 8.
    password: buggy ? pw > 8 : pw >= 8,
    // 1.0 lets zero through.
    qty: isInt(qtyS) && (buggy ? qty >= 0 && qty <= 10 : qty >= 1 && qty <= 10),
    // 1.0 compares the code case-sensitively.
    coupon: !code || (buggy ? code === COUPON : code.toUpperCase() === COUPON),
  };
  if (!valid.name) errors.name = 'Enter your full name';
  if (!valid.email) errors.email = 'Enter a valid email address';
  if (!valid.password) errors.password = 'Password must be at least 8 characters';
  if (!valid.qty) errors.qty = 'Quantity must be a whole number from 1 to 10';
  if (!valid.coupon) errors.coupon = 'This code isn’t recognised';

  const ok = Object.values(valid).every(Boolean);
  const order = ok ? price(qty, code ? COUPON_PCT : 0, build) : null;
  return { ok, valid, errors, order, unencoded: buggy && ok && /[<>]/.test(name) };
}

export type DefectId = 'BUG-01' | 'BUG-02' | 'BUG-03' | 'BUG-04' | 'BUG-05' | 'BUG-06';

/** Runs the input on both builds and returns the defects it exposes. */
export function expose(f: CheckoutForm): { result: Submission; hits: { id: DefectId; input: string }[] } {
  const b = submit(f, '1.0');
  const r = submit(f, '1.1');
  const q = (s: string) => JSON.stringify(s);
  const hits: { id: DefectId; input: string }[] = [];
  if (b.valid.email !== r.valid.email) hits.push({ id: 'BUG-01', input: `email = ${q(f.email)}` });
  if (b.valid.password !== r.valid.password) hits.push({ id: 'BUG-02', input: `password length = ${f.password.length}` });
  if (b.valid.qty !== r.valid.qty) hits.push({ id: 'BUG-03', input: `quantity = ${q(f.qty)}` });
  if (b.valid.coupon !== r.valid.coupon) hits.push({ id: 'BUG-04', input: `coupon = ${q(f.coupon)}` });
  if (b.ok && r.ok && b.order!.vat !== r.order!.vat) hits.push({ id: 'BUG-05', input: `quantity = ${q(f.qty)}, coupon = ${q(f.coupon)}` });
  if (b.unencoded) hits.push({ id: 'BUG-06', input: `name = ${q(f.name)}` });
  return { result: b, hits };
}

export const money = (pence: number) =>
  `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
