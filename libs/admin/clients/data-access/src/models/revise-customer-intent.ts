import type { CustomerDraft } from '@admin/clients/model';

export interface ReviseCustomerIntent {
  customerId: string;
  revision: number;
  draft: CustomerDraft;
  requestId: string;
}
