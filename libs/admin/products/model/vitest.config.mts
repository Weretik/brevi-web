import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/products/model-tests',
  test: { name: 'admin-products-model', environment: 'node', include: ['src/**/*.test.ts'] },
});
