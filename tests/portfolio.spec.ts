import { test, expect } from '@playwright/test';
import { projects } from '../src/content/projects';
import { site } from '../src/content/site';

test.describe('home', () => {
  test('renders one h1 and every section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    for (const id of ['work', 'about', 'strengths', 'flowqa', 'experience', 'credentials', 'contact']) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test('lists every project with a working case study link', async ({ page }) => {
    await page.goto('/');
    for (const p of projects) {
      await expect(page.locator('#work').getByRole('link', { name: p.name, exact: true })).toHaveAttribute(
        'href',
        `/work/${p.slug}`,
      );
    }
  });

  test('skip link moves focus to main content', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard flow');
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(skip).toHaveAttribute('href', '#main');
  });

  test('CV downloads as a PDF', async ({ page, request }) => {
    const res = await request.get(site.resume.href);
    expect(res.ok()).toBeTruthy();
    expect(res.headers()['content-type']).toContain('application/pdf');
    await page.goto('/');
    await expect(page.locator(`a[href="${site.resume.href}"][download]`).first()).toBeAttached();
  });

  test('has no horizontal overflow', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
});

test.describe('navigation', () => {
  test('mobile menu opens and links to sections', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile only');
    await page.goto('/');
    const menu = page.getByRole('button', { name: 'Menu' });
    await menu.click();
    await expect(page.getByRole('button', { name: 'Close' })).toHaveAttribute('aria-expanded', 'true');
    await page.locator('#mobile-nav').getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator('#mobile-nav')).toHaveCount(0);
  });

  test('theme toggle switches and persists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByRole('button', { name: 'Switch to light theme' }).first().click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});

test.describe('case studies', () => {
  for (const p of projects) {
    test(`${p.slug} renders`, async ({ page }) => {
      const res = await page.goto(`/work/${p.slug}`);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(p.name);
      await expect(page.getByText(p.metric.value).first()).toBeVisible();
      await expect(page).toHaveTitle(new RegExp(p.name));
    });
  }

  test('unknown project returns 404', async ({ page }) => {
    const res = await page.goto('/work/does-not-exist');
    expect(res?.status()).toBe(404);
  });
});

test.describe('contact form', () => {
  test('shows errors for empty and invalid fields', async ({ page }) => {
    await page.goto('/#contact');
    const form = page.locator('#contact form');
    await form.getByRole('button', { name: 'Send message' }).click();
    await expect(form.getByLabel('Name')).toHaveAttribute('aria-invalid', 'true');
    await expect(form.getByLabel('Name')).toBeFocused();
    await expect(form.getByLabel('Message')).toHaveAttribute('aria-invalid', 'true');

    await form.getByLabel('Name').fill('Recruiter');
    await form.getByLabel('Email').fill('not-an-email');
    await form.getByLabel('Message').fill('Hello');
    await form.getByRole('button', { name: 'Send message' }).click();
    await expect(form.getByText('Enter a valid email address')).toBeVisible();
    await expect(form.getByLabel('Name')).not.toHaveAttribute('aria-invalid', 'true');
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('content is visible without animation and Lenis is off', async ({ page }) => {
    await page.goto('/');
    await page.locator('#credentials').scrollIntoViewIfNeeded();
    await expect(page.locator('#credentials [data-reveal]').first()).toHaveCSS('opacity', '1');
    await expect(page.locator('html')).not.toHaveClass(/lenis/);
  });
});

test('SEO files are served', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBeTruthy();
  const xml = await sitemap.text();
  for (const p of projects) expect(xml).toContain(`/work/${p.slug}`);
  expect((await request.get('/robots.txt')).ok()).toBeTruthy();
  expect((await request.get('/opengraph-image')).headers()['content-type']).toContain('image/png');
});
