import {
  dateTime,
  integer,
  nullableDateTime,
  nullableText,
  record,
} from '../../validators/purchase-response';

import type { PurchaseSyncResult, PurchaseSyncState } from '@admin/purchasing/model';

export function mapPurchaseSyncState(value: unknown): PurchaseSyncState {
  const row = record(value, 'стан оновлення');
  return {
    lastSuccessAt: nullableDateTime(row['lastSuccessAt'], 'останнє оновлення'),
    lastAttemptAt: nullableDateTime(row['lastAttemptAt'], 'остання спроба'),
    error: nullableText(row['error'], 'помилка'),
    recordCount: integer(row['recordCount'], 'рядків'),
    fileCount: integer(row['fileCount'], 'файлів'),
  };
}

export function mapPurchaseSyncResult(value: unknown): PurchaseSyncResult {
  const row = record(value, 'результат оновлення');
  const count = (key: string) => integer(row[key], key);
  return {
    recordCount: count('recordCount'),
    fileCount: count('fileCount'),
    messagesAdded: count('messagesAdded'),
    messagesUpdated: count('messagesUpdated'),
    rowsAdded: count('rowsAdded'),
    rowsUpdated: count('rowsUpdated'),
    rowsDeactivated: count('rowsDeactivated'),
    filesAdded: count('filesAdded'),
    filesDeactivated: count('filesDeactivated'),
    syncedAt: dateTime(row['syncedAt'], 'час оновлення'),
  };
}
