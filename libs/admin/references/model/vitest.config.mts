import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/references/model-tests',
  test: { name: 'admin-references-model', environment: 'node', include: ['src/**/*.test.ts'] },
});
