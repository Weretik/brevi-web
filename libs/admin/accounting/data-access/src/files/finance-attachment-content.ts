import { requestApiBlob } from '@admin/shared/api-client';

/** The content of a file of an operation; it is never public, so it is read with the session. */
export function fetchFinanceAttachmentContent(id: string): Promise<Blob> {
  return requestApiBlob({ url: `/api/accounting/attachments/${encodeURIComponent(id)}/content` });
}
