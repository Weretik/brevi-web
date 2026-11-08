import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/leads/model-tests',
  test: { name: 'admin-leads-model', environment: 'node', include: ['src/**/*.test.ts'] },
});
