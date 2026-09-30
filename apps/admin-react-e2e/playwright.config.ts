import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env['ADMIN_REACT_BASE_URL'] ?? 'http://localhost:4300';

export default defineConfig({
  testDir: './src',
  outputDir: '../../test-results/admin-react-e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env['CI']),
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: '../../playwright-report/admin-react-e2e', open: 'never' }],
  ],
  use: {
    baseURL,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npx vite --config ../admin-react/vite.config.mts --port ${new URL(baseURL).port || '4300'}`,
    url: baseURL,
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
});
