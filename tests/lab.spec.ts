import { test, expect, type Page } from '@playwright/test';

// The Test Lab: every demo is driven to completion the way a visitor would.
test.use({ reducedMotion: 'reduce' });

const openCard = async (page: Page, title: RegExp) => {
  await page.goto('/');
  await page.locator('#lab').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: title }).click();
  await expect(page.locator('dialog.lab-modal')).toBeVisible();
};
const guide = (page: Page) => page.locator('.lab-guide');

test('section lists five demos and Esc returns focus to the card', async ({ page, isMobile }) => {
  await page.goto('/');
  const cards = page.locator('#lab ul > li button');
  await expect(cards).toHaveCount(5);
  test.skip(isMobile, 'keyboard flow');
  await cards.first().focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('dialog.lab-modal')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog.lab-modal')).toBeHidden();
  await expect(cards.first()).toBeFocused();
});

test('API: unknown product breaks the contract and the collection finds 2 failures', async ({ page }) => {
  await openCard(page, /^API contract testing/);
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: '201 Created' })).toBeVisible();
  await page.locator('.api-side button', { hasText: 'Unknown product' }).click();
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(page.locator('.api-results')).toContainText('Status code is 404');
  await expect(page.locator('.api-results .api-badge.f').first()).toBeVisible();
  await page.getByRole('button', { name: 'Run collection' }).click();
  await expect(guide(page)).toContainText('7 passed, 2 failed');
});

test('Functional: exploratory inputs expose all six defects', async ({ page }) => {
  await openCard(page, /^Break the checkout/);
  await page.getByRole('button', { name: 'Fill valid example' }).click();
  const order = async (field: string, value: string) => {
    await page.fill(`#fx-${field}`, value);
    await page.getByRole('button', { name: 'Place order' }).click();
  };
  await order('email', 'priya@example');
  await order('email', 'priya@example.com');
  await order('password', 'Abcdef1!');
  await order('password', 'Passw0rd!');
  await order('qty', '0');
  await order('qty', '2');
  await order('coupon', 'save10');
  await order('coupon', 'SAVE10');
  await order('coupon', '');
  await order('name', '<b>x</b>');
  await expect(page.getByText('6 / 6 found')).toBeVisible();
  await expect(guide(page)).toContainText('All 6 defects exposed');
});

test('Boundary: the 2-value set exposes the upper-edge defect', async ({ page }) => {
  await openCard(page, /^Boundary values/);
  await page.getByRole('button', { name: '+ 2-value BVA set' }).click();
  await expect(guide(page)).toContainText('Defect exposed by 70');
  await page.locator('.lab-panel select').selectOption('none');
  await expect(page.getByText('This build has no defect')).toBeVisible();
});

test('Automation: suite fails 6 on build 1.0 and passes on 1.1', async ({ page }) => {
  await openCard(page, /^Regression suite/);
  await page.getByRole('button', { name: '▶ Run suite' }).click();
  await expect(page.locator('.ed-foot')).toContainText('5 passed · 6 failed', { timeout: 30_000 });
  await page.getByLabel('Build under test').selectOption('1.1');
  await page.getByRole('button', { name: '▶ Run suite' }).click();
  await expect(page.locator('.ed-foot')).toContainText('11 passed · 0 failed', { timeout: 30_000 });
  await expect(guide(page)).toContainText('All 11 pass');
});

test('Accessibility: axe finds violations on 1.0 and none on 1.1', async ({ page }) => {
  await openCard(page, /^Accessibility audit/);
  await page.getByRole('button', { name: 'Run scan' }).click();
  // Always flagged on 1.0. Colour contrast can come back as "needs review"
  // instead of a violation depending on the viewport, so it isn't required here.
  const list = page.locator('.devtools-list');
  for (const rule of ['button-name', 'image-alt', 'label', 'link-name'])
    await expect(list.getByText(`Rule ${rule}`, { exact: false })).toBeVisible({ timeout: 30_000 });
  await page.locator('.devtools-list button').first().click();
  await expect(page.locator('[data-a11y-specimen] [data-hl="true"]')).toHaveCount(1);
  await page.locator('.devtools-bar select').selectOption('1.1');
  await page.getByRole('button', { name: 'Run scan' }).click();
  await expect(page.getByText('No automated violations found.')).toBeVisible({ timeout: 30_000 });
});

test('progress persists and the bug report opens the checkout demo', async ({ page }) => {
  await openCard(page, /^Boundary values/);
  await page.getByRole('button', { name: '+ 2-value BVA set' }).click();
  await page.getByRole('button', { name: 'Close demo' }).click();
  await page.reload();
  await expect(page.locator('#lab').getByText('✓ Done')).toHaveCount(1);
  await page.getByRole('button', { name: 'Reproduce it in the Test Lab' }).click();
  await expect(page.getByRole('heading', { name: 'Functional testing' })).toBeVisible();
});

test('page behind the open demo does not scroll, and closing restores the position', async ({ page, isMobile }) => {
  await page.goto('/');
  await page.locator('#lab').scrollIntoViewIfNeeded();
  await page.locator('#lab ul > li button').first().click();
  await expect(page.locator('dialog.lab-modal')).toBeVisible();
  // Pinned in place: a swipe or wheel outside the panel has nothing to scroll.
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).position)).toBe('fixed');
  // Where the page sat when the demo opened (the click may have scrolled it first).
  const before = await page.evaluate(() => -document.body.getBoundingClientRect().top);
  if (!isMobile) {
    await page.mouse.move(8, 400);
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(300);
    const top = await page.evaluate(() => document.body.getBoundingClientRect().top);
    expect(Math.round(-top)).toBe(Math.round(before));
  }
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog.lab-modal')).toBeHidden();
  await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(Math.round(before));
});
