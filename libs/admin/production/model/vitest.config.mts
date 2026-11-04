import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/production/model-tests',
  test: { name: 'admin-production-model', environment: 'node', include: ['src/**/*.test.ts'] },
});
