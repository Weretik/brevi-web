import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/clients/model-tests',
  test: { name: 'admin-clients-model', environment: 'node', include: ['src/**/*.test.ts'] },
});
