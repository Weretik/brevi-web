import type { CustomerDraft } from '@admin/clients/model';

export interface CreateCustomerIntent {
  draft: CustomerDraft;
  requestId: string;
}
