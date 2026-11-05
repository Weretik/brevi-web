import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/accounting/model-tests',
  test: { name: 'admin-accounting-model', environment: 'node', include: ['src/**/*.test.ts'] },
});
