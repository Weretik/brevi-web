import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/shared/config-tests',
  test: { name: 'admin-shared-config', environment: 'node', include: ['src/**/*.test.ts'] },
});
