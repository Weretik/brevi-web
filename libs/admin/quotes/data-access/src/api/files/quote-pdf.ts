import { requestApiBlob } from '@admin/shared/api-client';

/** The PDF built on the server from the saved КП. */
export function fetchQuotePdf(id: number): Promise<Blob> {
  return requestApiBlob({ url: `/api/crm/quotes/${id}/pdf` });
}

/** Saves a КП PDF as «КП <number>.pdf». */
export function saveQuotePdf(blob: Blob, number: string): void {
  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = `КП ${number}.pdf`;
    document.body.append(link);
    link.click();
    link.remove();
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

/** Downloads the PDF built from the saved КП and saves it as «КП <number>.pdf». */
export async function downloadQuotePdf(id: number, number: string): Promise<void> {
  saveQuotePdf(await fetchQuotePdf(id), number);
}
