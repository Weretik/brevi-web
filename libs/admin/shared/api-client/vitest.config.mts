import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/shared/api-client-tests',
  resolve: { tsconfigPaths: true },
  test: { name: 'admin-shared-api-client', environment: 'node', include: ['src/**/*.test.ts'] },
});
