import { defineConfig, devices } from '@playwright/test';

const PORT = 3123;
// Set BASE_URL to test a deployed site instead of a local production build.
const BASE_URL = process.env.BASE_URL;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: BASE_URL ?? `http://localhost:${PORT}`, trace: 'on-first-retry' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: BASE_URL
    ? undefined
    : {
        command: `pnpm start -p ${PORT}`,
        port: PORT,
        reuseExistingServer: !process.env.CI,
      },
});
