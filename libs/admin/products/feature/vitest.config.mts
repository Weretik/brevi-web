import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/products/feature-tests',
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    name: 'admin-products-feature',
    environment: 'jsdom',
    // MUI data grids render slowly in jsdom when several projects run in parallel.
    testTimeout: 20_000,
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
