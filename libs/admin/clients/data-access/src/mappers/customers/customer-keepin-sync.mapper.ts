import { flag, integer, items, record, text } from '../../validators/customers/customer-response';

import type { CustomerKeepinSyncResult } from '@admin/clients/model';

export function mapCustomerKeepinSyncResult(value: unknown): CustomerKeepinSyncResult {
  const row = record(value);
  return {
    applied: flag(row['applied']),
    received: integer(row['received'], 0),
    created: integer(row['created'], 0),
    updated: integer(row['updated'], 0),
    unchanged: integer(row['unchanged'], 0),
    deactivated: items(row['deactivated']).map(text),
    deleted: items(row['deleted']).map(text),
    hiddenInUse: items(row['hiddenInUse']).map(text),
  };
}
