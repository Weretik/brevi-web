import { mapCustomerSummary } from './customer-summary.mapper';
import {
  flag,
  identifier,
  items,
  nullableText,
  record,
  text,
} from '../../validators/customers/customer-response';

import type { CustomerChannel, CustomerDetail } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

type DetailResponse = operations['getCrmCustomer']['responses'][200]['content']['application/json'];
export function mapCustomerDetail(value: unknown): CustomerDetail {
  const row = record(value);
  const customer = mapCustomerSummary(row);
  const mapped: CustomerDetail = {
    ...customer,
    canEdit: flag(row['canEdit']),
    canMerge: flag(row['canMerge']),
    contacts: items(row['contacts']).map((value) => {
      const contact = record(value);
      return {
        publicId: identifier(contact['publicId']),
        name: text(contact['name']),
        position: nullableText(contact['position']),
        active: flag(contact['active']),
        isPrimary: flag(contact['isPrimary']),
        channels: items(contact['channels']).map((value) => {
          const channel = record(value);
          if (channel['kind'] !== 'email' && channel['kind'] !== 'phone')
            throw new Error('Невідомий канал контакту.');
          return { kind: channel['kind'], value: text(channel['value']) } satisfies CustomerChannel;
        }),
      };
    }),
    externalIdentities: items(row['externalIdentities']).map((value) => {
      const identity = record(value);
      return {
        source: text(identity['source']),
        type: text(identity['type']),
        externalId: text(identity['externalId']),
      };
    }),
  };
  // Generated wire type stays at this boundary; application models remain independent.
  const compatible: DetailResponse = {
    ...mapped,
    contacts: mapped.contacts.map((c) => ({ ...c, channels: [...c.channels] })),
    externalIdentities: [...mapped.externalIdentities],
  };
  return compatible;
}
