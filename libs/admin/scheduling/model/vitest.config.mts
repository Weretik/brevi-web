import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/scheduling/model-tests',
  test: { name: 'admin-scheduling-model', environment: 'node', include: ['src/**/*.test.ts'] },
});
