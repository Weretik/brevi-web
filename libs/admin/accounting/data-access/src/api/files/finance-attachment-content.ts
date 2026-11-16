import { apiClient, apiRequest } from '@admin/shared/api-client';

/** The content of a file of an operation; it is never public, so it is read with the session. */
export function fetchFinanceAttachmentContent(id: string): Promise<Blob> {
  return apiRequest(
    apiClient.GET('/api/accounting/attachments/{id}/content', {
      params: { path: { id } },
      parseAs: 'blob',
    }),
  );
}
