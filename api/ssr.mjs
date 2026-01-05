import { createRequestHandler } from '@angular/ssr';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const handler = createRequestHandler({
  distPath: join(__dirname, '..', 'dist', 'apps', 'storefront')
});

export default function (req, res) {
  return handler(req, res);
}
