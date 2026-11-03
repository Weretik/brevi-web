import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/users/model-tests',
  test: { name: 'admin-users-model', environment: 'node', include: ['src/**/*.test.ts'] },
});
