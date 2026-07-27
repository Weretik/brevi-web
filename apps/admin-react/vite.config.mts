import babel from '@rolldown/plugin-babel';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');

  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/admin-react',
    base: env['VITE_ASSET_BASE'] || '/',
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      react(),
      babel({
        plugins: [['babel-plugin-react-compiler', { panicThreshold: 'none' }]],
      }),
    ],
    server: {
      host: 'localhost',
      port: 4300,
    },
    preview: {
      host: 'localhost',
      port: 4301,
    },
    build: {
      outDir: '../../dist/apps/admin-react',
      emptyOutDir: true,
    },
  };
});
