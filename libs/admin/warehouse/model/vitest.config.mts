import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/warehouse/model-tests',
  test: { name: 'admin-warehouse-model', environment: 'node', include: ['src/**/*.test.ts'] },
});
