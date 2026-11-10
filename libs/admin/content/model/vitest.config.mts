import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/content/model-tests',
  test: { name: 'admin-content-model', environment: 'node', include: ['src/**/*.test.ts'] },
});
