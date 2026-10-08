import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/work/nhs', '/work/flowqa', '/get/luv-or-pop'];

for (const theme of ['dark', 'light'] as const) {
  test.describe(`axe, ${theme} theme`, () => {
    test.use({ reducedMotion: 'reduce' });

    for (const path of pages) {
      test(`${path} has no WCAG A/AA violations`, async ({ page, isMobile }) => {
        test.skip(isMobile && path.startsWith('/get/'), 'phones are sent on to the store');
        await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
        await page.goto(path);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();
        expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
      });
    }
  });
}

test('no horizontal overflow at 360px', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 360, height: 640 } });
  for (const path of pages.filter((p) => !p.startsWith('/get/'))) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  }
  await page.close();
});
