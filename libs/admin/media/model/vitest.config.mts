import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/media/model-tests',
  test: { name: 'admin-media-model', environment: 'node', include: ['src/**/*.test.ts'] },
});
