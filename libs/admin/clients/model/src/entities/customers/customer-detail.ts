import type { CustomerSummary } from './customer-summary';
import type { ExternalIdentity } from './external-identity';
import type { CustomerContact } from '../contacts/customer-contact';

export interface CustomerDetail extends CustomerSummary {
  readonly canEdit: boolean;
  readonly canMerge: boolean;
  readonly contacts: readonly CustomerContact[];
  readonly externalIdentities: readonly ExternalIdentity[];
}
