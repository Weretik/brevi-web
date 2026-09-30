import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/products/data-access-tests',
  resolve: { tsconfigPaths: true },
  test: {
    name: 'admin-products-data-access',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
