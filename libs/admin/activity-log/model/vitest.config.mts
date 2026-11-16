import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  resolve: { tsconfigPaths: true },
  cacheDir: '../../../../node_modules/.vite/libs/admin/activity-log/model-tests',
  test: { name: 'admin-activity-log-model', environment: 'node', include: ['src/**/*.test.ts'] },
});
