import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/tasks/model-tests',
  test: { name: 'admin-tasks-model', environment: 'node', include: ['src/**/*.test.ts'] },
});
