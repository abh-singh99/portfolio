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

  test('lists every project', async ({ page }) => {
    await page.goto('/');
    for (const p of projects) {
      await expect(page.locator('#work').getByRole('heading', { name: p.name, exact: true })).toBeVisible();
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
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    });
  }

  test('unknown project returns 404', async ({ page }) => {
    const res = await page.goto('/work/does-not-exist');
    expect(res?.status()).toBe(404);
  });
});

test.describe('contact', () => {
  test('offers email, CV and profile links', async ({ page }) => {
    await page.goto('/#contact');
    const c = page.locator('#contact');
    await expect(c.getByRole('link', { name: site.email })).toHaveAttribute('href', `mailto:${site.email}`);
    await expect(c.getByRole('link', { name: 'Email me' })).toHaveAttribute('href', `mailto:${site.email}`);
    await expect(c.getByRole('link', { name: site.resume.label })).toHaveAttribute('href', site.resume.href);
    for (const s of site.socials) {
      await expect(c.getByRole('link', { name: s.label })).toHaveAttribute('href', s.href);
    }
  });

  test('copy button copies the email address', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard permissions');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/#contact');
    // Retry the click: one that lands before hydration has no handler yet.
    await expect(async () => {
      await page.locator('#contact').getByRole('button', { name: /Copy email address|Copied/ }).click();
      await expect(page.locator('#contact').getByRole('button', { name: /Copied/ })).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 10_000 });
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(site.email);
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
  expect(xml).toContain(site.url);
  for (const p of projects) expect(xml).not.toContain(`/work/${p.slug}`);
  expect((await request.get('/robots.txt')).ok()).toBeTruthy();
  expect((await request.get('/opengraph-image')).headers()['content-type']).toContain('image/png');
});

test.describe('project links', () => {
  test('website screens open the live site in a new tab', async ({ page }) => {
    await page.goto('/');
    for (const p of projects.filter((p) => p.link?.kind === 'site')) {
      const link = page.locator('#work').getByRole('link', { name: new RegExp(`^Visit site: ${p.name}`) });
      await expect(link).toHaveAttribute('href', p.link!.kind === 'site' ? p.link!.href : '');
      await expect(link).toHaveAttribute('target', '_blank');
    }
  });

  test('app screens lead to their store page', async ({ page }) => {
    await page.goto('/');
    for (const p of projects.filter((p) => p.link?.kind === 'app')) {
      await expect(page.locator('#work').getByRole('link', { name: `Get the app: ${p.name}` })).toHaveAttribute(
        'href',
        `/get/${p.slug}`,
      );
    }
  });

  test('products that are not live show a note', async ({ page }) => {
    await page.goto('/');
    for (const p of projects.filter((p) => p.link?.kind === 'soon')) {
      const note = p.link!.kind === 'soon' ? p.link!.note : '';
      await expect(async () => {
        await page.getByRole('button', { name: `${p.name}: Coming soon` }).click();
        await expect(page.getByRole('status').filter({ hasText: note })).toBeVisible({ timeout: 1000 });
      }).toPass();
    }
  });

  test('store page sends phones to their store and shows buttons elsewhere', async ({ page, isMobile }) => {
    // Never actually leave for the stores; record where the page tried to go.
    const visited: string[] = [];
    await page.route(/(play\.google\.com|apps\.apple\.com)/, (route) => {
      visited.push(route.request().url());
      return route.fulfill({ body: 'store' });
    });
    for (const p of projects.filter((p) => p.link?.kind === 'app')) {
      const link: { android?: string; ios?: string } = p.link!.kind === 'app' ? p.link! : {};
      await page.goto(`/get/${p.slug}`);
      if (isMobile && link.android) {
        // The Pixel 7 project is Android.
        await expect.poll(() => visited).toContain(link.android);
      } else {
        await expect(page.getByRole('heading', { level: 1, name: `Get ${p.name}` })).toBeVisible();
        if (link.android) await expect(page.getByRole('link', { name: 'Get it on Google Play' })).toHaveAttribute('href', link.android);
        if (link.ios) await expect(page.getByRole('link', { name: 'Download on the App Store' })).toHaveAttribute('href', link.ios);
      }
    }
  });
});
