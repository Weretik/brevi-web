import { join } from 'node:path';

import babel from '@rolldown/plugin-babel';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

import { environment as developmentEnvironment } from './src/environments/environment';
import { environment as productionEnvironment } from './src/environments/environment.prod';

export default defineConfig(({ mode }) => {
  const envDir = join(import.meta.dirname, 'src/environments');
  const env = loadEnv(mode, envDir, 'VITE_');
  const environment = mode === 'production' ? productionEnvironment : developmentEnvironment;
  const environmentModule = join(
    import.meta.dirname,
    'src/environments',
    mode === 'production' ? 'environment.prod.ts' : 'environment.ts',
  );
  const apiProxy = {
    '/api': {
      target: environment.api.baseUrl,
      changeOrigin: true,
      secure: !environment.api.baseUrl.startsWith('https://localhost:'),
    },
  };

  return {
    root: import.meta.dirname,
    envDir,
    cacheDir: '../../node_modules/.vite/apps/admin-react',
    base: env['VITE_ASSET_BASE'] || '/',
    resolve: {
      alias: {
        './environments/environment': environmentModule,
      },
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
      proxy: apiProxy,
    },
    preview: {
      host: 'localhost',
      port: 4301,
      proxy: apiProxy,
    },
    build: {
      outDir: '../../dist/apps/admin-react',
      emptyOutDir: true,
    },
  };
});
