import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/quotes/model-tests',
  test: { name: 'admin-quotes-model', environment: 'node', include: ['src/**/*.test.ts'] },
});
