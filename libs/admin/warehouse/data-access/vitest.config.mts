import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/warehouse/data-access-tests',
  resolve: { tsconfigPaths: true },
  test: {
    name: 'admin-warehouse-data-access',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
