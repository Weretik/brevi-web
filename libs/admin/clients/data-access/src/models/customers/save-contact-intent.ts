import type { ContactDraft } from '@admin/clients/model';

export interface SaveContactIntent {
  customerId: string;
  contactId?: string;
  revision: number;
  draft: ContactDraft;
  requestId: string;
}
