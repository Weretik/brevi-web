import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/core/auth-tests',
  resolve: { tsconfigPaths: true },
  test: {
    name: 'admin-core-auth',
    environment: 'jsdom',
    globals: false,
    include: ['src/**/*.{test,spec}.ts'],
  },
});
