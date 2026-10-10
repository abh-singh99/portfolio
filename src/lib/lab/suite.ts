// The checkout regression suite. Each check runs against a build of the real
// submit logic in checkout.ts; `code` is the Playwright-style source shown in
// the editor, `fill` is what the browser types before pressing Place order.

import { submit, VALID, EMPTY, money, type Build, type CheckoutForm } from './checkout';

export type SuiteTest = {
  id: string;
  title: string;
  technique: string;
  fill: CheckoutForm;
  code: string[];
  run: (build: Build) => { pass: boolean; expected: string; actual: string };
};

const said = (e?: string) => (e ? 'rejected' : 'accepted');

export const SUITE: SuiteTest[] = [
  {
    id: 'TC-01', title: 'valid order is accepted', technique: 'Smoke', fill: VALID,
    code: ["await checkout.fill(valid);", "await checkout.placeOrder();", "await expect(page.getByTestId('total')).toHaveText('£288.00');"],
    run: (b) => { const r = submit(VALID, b); return { pass: r.ok && r.order!.total === 28800, expected: 'accepted, total £288.00', actual: r.ok ? `accepted, total ${money(r.order!.total)}` : 'rejected' }; },
  },
  {
    id: 'TC-02', title: 'email without an extension is rejected', technique: 'Equivalence partitioning', fill: { ...VALID, email: 'priya@example' },
    code: ["await checkout.fill({ ...valid, email: 'priya@example' });", "await checkout.placeOrder();", "await expect(checkout.error('email')).toBeVisible();"],
    run: (b) => { const r = submit({ ...VALID, email: 'priya@example' }, b); return { pass: !!r.errors.email, expected: 'priya@example rejected', actual: `priya@example ${said(r.errors.email)}` }; },
  },
  {
    id: 'TC-03', title: 'password of 7 characters is rejected', technique: 'Boundary value', fill: { ...VALID, password: 'Abcde1!' },
    code: ["await checkout.fill({ ...valid, password: 'Abcde1!' });", "await checkout.placeOrder();", "await expect(checkout.error('password')).toBeVisible();"],
    run: (b) => { const r = submit({ ...VALID, password: 'Abcde1!' }, b); return { pass: !!r.errors.password, expected: '7 characters rejected', actual: `7 characters ${said(r.errors.password)}` }; },
  },
  {
    id: 'TC-04', title: 'password of exactly 8 characters is accepted', technique: 'Boundary value', fill: { ...VALID, password: 'Abcdef1!' },
    code: ["await checkout.fill({ ...valid, password: 'Abcdef1!' });", "await checkout.placeOrder();", "await expect(checkout.error('password')).toBeHidden();"],
    run: (b) => { const r = submit({ ...VALID, password: 'Abcdef1!' }, b); return { pass: !r.errors.password, expected: '8 characters accepted', actual: `8 characters ${said(r.errors.password)}` }; },
  },
  {
    id: 'TC-05', title: 'quantity 0 is rejected', technique: 'Boundary value', fill: { ...VALID, qty: '0' },
    code: ["await checkout.fill({ ...valid, qty: '0' });", "await checkout.placeOrder();", "await expect(checkout.error('qty')).toBeVisible();"],
    run: (b) => { const r = submit({ ...VALID, qty: '0' }, b); return { pass: !!r.errors.qty, expected: 'quantity 0 rejected', actual: `quantity 0 ${said(r.errors.qty)}` }; },
  },
  {
    id: 'TC-06', title: 'quantity 10 is accepted and 11 is rejected', technique: 'Boundary value', fill: { ...VALID, qty: '11' },
    code: ["for (const [qty, ok] of [['10', true], ['11', false]]) {", "  await checkout.fill({ ...valid, qty });", "  await expect(checkout.error('qty')).toBeVisible({ visible: !ok });", "}"],
    run: (b) => { const a = submit({ ...VALID, qty: '10' }, b), c = submit({ ...VALID, qty: '11' }, b); return { pass: !a.errors.qty && !!c.errors.qty, expected: '10 accepted, 11 rejected', actual: `10 ${said(a.errors.qty)}, 11 ${said(c.errors.qty)}` }; },
  },
  {
    id: 'TC-07', title: 'coupon works in lower case', technique: 'Equivalence partitioning', fill: { ...VALID, coupon: 'save10' },
    code: ["await checkout.fill({ ...valid, coupon: 'save10' });", "await checkout.placeOrder();", "await expect(checkout.error('coupon')).toBeHidden();"],
    run: (b) => { const r = submit({ ...VALID, coupon: 'save10' }, b); return { pass: !r.errors.coupon, expected: 'save10 accepted', actual: `save10 ${said(r.errors.coupon)}` }; },
  },
  {
    id: 'TC-08', title: 'unknown coupon is rejected', technique: 'Negative', fill: { ...VALID, coupon: 'FREE100' },
    code: ["await checkout.fill({ ...valid, coupon: 'FREE100' });", "await checkout.placeOrder();", "await expect(checkout.error('coupon')).toBeVisible();"],
    run: (b) => { const r = submit({ ...VALID, coupon: 'FREE100' }, b); return { pass: !!r.errors.coupon, expected: 'FREE100 rejected', actual: `FREE100 ${said(r.errors.coupon)}` }; },
  },
  {
    id: 'TC-09', title: 'VAT is charged on the discounted amount', technique: 'Calculation oracle', fill: { ...VALID, coupon: 'SAVE10' },
    code: ["// £240.00 − 10% = £216.00, VAT 20% = £43.20", "await checkout.fill({ ...valid, coupon: 'SAVE10' });", "await checkout.placeOrder();", "await expect(page.getByTestId('total')).toHaveText('£259.20');"],
    run: (b) => { const r = submit({ ...VALID, coupon: 'SAVE10' }, b); return { pass: r.ok && r.order!.total === 25920, expected: 'total £259.20', actual: r.ok ? `total ${money(r.order!.total)}` : 'rejected' }; },
  },
  {
    id: 'TC-10', title: 'markup in the name is shown as text', technique: 'Security probe', fill: { ...VALID, name: '<img src=x onerror=alert(1)>' },
    code: ["await checkout.fill({ ...valid, name: '<img src=x onerror=alert(1)>' });", "await checkout.placeOrder();", "await expect(page.locator('.confirmation img')).toHaveCount(0);"],
    run: (b) => { const r = submit({ ...VALID, name: '<img src=x onerror=alert(1)>' }, b); return { pass: !r.unencoded, expected: 'name rendered as plain text', actual: r.unencoded ? 'name rendered as live markup (simulated)' : 'rendered as plain text' }; },
  },
  {
    id: 'TC-11', title: 'empty form flags every required field', technique: 'Negative', fill: EMPTY,
    code: ["await checkout.placeOrder();", "await expect(checkout.errors).toHaveCount(4);"],
    run: (b) => { const n = Object.keys(submit(EMPTY, b).errors).length; return { pass: n === 4, expected: '4 field errors', actual: `${n} field errors` }; },
  },
];
