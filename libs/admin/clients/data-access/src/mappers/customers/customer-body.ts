import type { CustomerDraft } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

type Input = operations['createCrmCustomer']['requestBody']['content']['application/json']['input'];
export function customerBody(draft: CustomerDraft): Input {
  return {
    kind: draft.kind,
    displayName: draft.displayName.trim(),
    legalName: draft.legalName.trim() || null,
    taxIdentity: draft.taxIdentity.trim() || null,
    externalIdentities: draft.externalIdentities.map((identity) => ({ ...identity })),
  };
}
