import {
  flag,
  identifier,
  integer,
  nullableText,
  record,
  text,
} from '../../validators/customers/customer-response';

import type { CustomerSummary } from '@admin/clients/model';

export function mapCustomerSummary(value: unknown): CustomerSummary {
  const row = record(value);
  if (row['kind'] !== 'person' && row['kind'] !== 'organization')
    throw new Error('Невідомий тип клієнта.');
  const updatedAt = text(row['updatedAt']);
  if (!Number.isFinite(Date.parse(updatedAt))) throw new Error('Некоректна дата зміни клієнта.');
  return {
    publicId: identifier(row['publicId']),
    kind: row['kind'],
    displayName: text(row['displayName']),
    legalName: nullableText(row['legalName']),
    taxIdentity: nullableText(row['taxIdentity']),
    ownerId: integer(row['ownerId']),
    active: flag(row['active']),
    revision: integer(row['revision']),
    updatedAt,
  };
}
