import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/site/delivery/feature',
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [react()],
  test: {
    name: 'site-delivery-feature',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../coverage/libs/site/delivery/feature',
      provider: 'v8' as const,
    },
  },
}));
