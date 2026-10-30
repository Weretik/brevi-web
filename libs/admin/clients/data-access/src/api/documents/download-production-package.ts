import { requestApiBlob } from '@admin/shared/api-client';

import { documentQuoteUrl } from './quote-document-api';

import type { ProductionPackageView } from '@admin/clients/model';

export async function downloadProductionPackage(value: ProductionPackageView): Promise<Blob> {
  const blob = await requestApiBlob({
    url: `${documentQuoteUrl(value.quoteId)}/production-packages/${encodeURIComponent(value.id)}/content`,
    headers: { 'Cache-Control': 'no-store' },
  });
  if (
    !(blob instanceof Blob) ||
    blob.type !== 'application/zip' ||
    blob.size !== value.bytes ||
    blob.size > 64 * 1024 * 1024
  )
    throw new Error('Некоректний ZIP-файл.');
  const bytes = await blob.arrayBuffer();
  const signature = new Uint8Array(bytes, 0, Math.min(4, bytes.byteLength));
  if (
    signature.length !== 4 ||
    signature[0] !== 80 ||
    signature[1] !== 75 ||
    signature[2] !== 3 ||
    signature[3] !== 4
  )
    throw new Error('Некоректний ZIP-файл.');
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('');
  if (hash.toLowerCase() !== value.sha256.toLowerCase())
    throw new Error('Контрольна сума ZIP не збігається.');
  return blob;
}
