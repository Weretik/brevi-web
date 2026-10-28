import type { ExternalIdentity } from '../entities/customers/external-identity';

export interface CustomerDraft {
  kind: 'organization' | 'person';
  displayName: string;
  legalName: string;
  taxIdentity: string;
  active: boolean;
  externalIdentities: readonly ExternalIdentity[];
}
