import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/embroidery/model-tests',
  test: { name: 'admin-embroidery-model', environment: 'node', include: ['src/**/*.test.ts'] },
});
