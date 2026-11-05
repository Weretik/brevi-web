import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../../node_modules/.vite/libs/admin/ai/model-tests',
  test: { name: 'admin-ai-model', environment: 'node', include: ['src/**/*.test.ts'] },
});
