import { defineConfig, devices } from '@playwright/test';

import { adminSessionFile } from './src/admin/admin-session';

// Full-stack checks: the Admin and the site run against a real BreviERP API and a seeded test database.
// The API must already listen on BREVI_API_URL; CI starts it in `.github/workflows/e2e.yml`.
const apiUrl = process.env['BREVI_API_URL'] ?? 'http://localhost:5082';
const adminUrl = 'http://localhost:4300';
const siteUrl = 'http://localhost:3001';
const isCi = Boolean(process.env['CI']);
const chrome = devices['Desktop Chrome'];

export default defineConfig({
  testDir: './src',
  outputDir: '../../test-results/stack-e2e',
  // One database for all tests: run them one at a time so no test sees another's half-done change.
  workers: 1,
  forbidOnly: isCi,
  // No retries: a repeat would meet the data the first attempt already changed. Reset the database to rerun.
  retries: 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: '../../playwright-report/stack-e2e', open: 'never' }],
  ],
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      // Signs in once, then adds through the API the reference rows a new database lacks.
      name: 'setup',
      testMatch: /\.setup\.ts/,
      use: { ...chrome, baseURL: adminUrl },
    },
    {
      name: 'admin',
      testDir: './src/admin',
      dependencies: ['setup'],
      use: { ...chrome, baseURL: adminUrl, storageState: adminSessionFile },
    },
    {
      // The КП uses the product the Admin tests created.
      name: 'quotes',
      testDir: './src/quotes',
      dependencies: ['admin'],
      use: { ...chrome, baseURL: adminUrl, storageState: adminSessionFile },
    },
    {
      // The Admin session is kept: a site request is then checked in «Заявки з сайту».
      name: 'site',
      testDir: './src/site',
      dependencies: ['setup'],
      use: { ...chrome, baseURL: siteUrl, storageState: adminSessionFile },
    },
  ],
  webServer: [
    {
      command: 'npx vite --config ../admin-react/vite.config.mts --port 4300',
      url: adminUrl,
      env: { ADMIN_API_PROXY_TARGET: apiUrl },
      reuseExistingServer: !isCi,
      timeout: 180_000,
    },
    {
      // A production build, as on Cloudflare: `nx build site` runs before this in CI.
      command: 'npx next start -p 3001',
      cwd: '../site',
      url: `${siteUrl}/uk`,
      env: { BREVI_API_URL: apiUrl, SITE_URL: siteUrl },
      reuseExistingServer: !isCi,
      timeout: 120_000,
    },
  ],
});
