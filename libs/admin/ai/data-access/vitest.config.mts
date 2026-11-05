import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/ai/data-access-tests',
  resolve: { tsconfigPaths: true },
  test: {
    name: 'admin-ai-data-access',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
