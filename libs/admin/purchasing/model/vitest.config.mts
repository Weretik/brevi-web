import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/purchasing/model-tests',
  test: { name: 'admin-purchasing-model', environment: 'node', include: ['src/**/*.test.ts'] },
});
