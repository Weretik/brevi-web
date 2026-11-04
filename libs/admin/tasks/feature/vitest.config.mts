import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/tasks/feature-tests',
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    name: 'admin-tasks-feature',
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    testTimeout: 10_000,
  },
});
