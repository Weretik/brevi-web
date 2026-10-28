import type { CustomerContact } from '../entities/contacts/customer-contact';
import type { CustomerDetail } from '../entities/customers/customer-detail';
import type { ContactDraft } from '../models/contact-draft';
import type { CustomerDraft } from '../models/customer-draft';

export function customerDraft(customer?: CustomerDetail): CustomerDraft {
  return {
    kind: customer?.kind ?? 'organization',
    displayName: customer?.displayName ?? '',
    legalName: customer?.legalName ?? '',
    taxIdentity: customer?.taxIdentity ?? '',
    active: customer?.active ?? true,
    externalIdentities: customer?.externalIdentities ?? [],
  };
}
export function contactDraft(contact?: CustomerContact): ContactDraft {
  return {
    name: contact?.name ?? '',
    position: contact?.position ?? '',
    active: contact?.active ?? true,
    isPrimary: contact?.isPrimary ?? false,
    channels: contact?.channels ?? [],
  };
}
