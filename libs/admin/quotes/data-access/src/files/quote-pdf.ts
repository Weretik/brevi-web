import { requestApiBlob } from '@admin/shared/api-client';

/** Downloads the PDF built from the saved КП and saves it as «КП <number>.pdf». */
export async function downloadQuotePdf(id: number, number: string): Promise<void> {
  const blob = await requestApiBlob({ url: `/api/crm/quotes/${id}/pdf` });
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
