import { createRequestHandler } from '@angular/ssr';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const handler = createRequestHandler({
  // путь к dist/apps/storefront
  distPath: `${__dirname}/../dist/apps/storefront`
});

export default async function (req, res) {
  return handler(req, res);
}
