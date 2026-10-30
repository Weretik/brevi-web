import { requestApiBlob } from '@admin/shared/api-client';

export async function downloadQuotePdfArtifact(quoteId: string, artifactId: string): Promise<Blob> {
  const blob = await requestApiBlob({
    url: `/api/crm/quotes/${encodeURIComponent(quoteId)}/documents/${encodeURIComponent(artifactId)}/content`,
    headers: { 'Cache-Control': 'no-store' },
  });
  if (
    !(blob instanceof Blob) ||
    blob.type !== 'application/pdf' ||
    blob.size < 5 ||
    blob.size > 20 * 1024 * 1024 ||
    new TextDecoder().decode(await blob.slice(0, 5).arrayBuffer()) !== '%PDF-'
  )
    throw new Error('Сервер повернув некоректний PDF-файл.');
  return blob;
}
