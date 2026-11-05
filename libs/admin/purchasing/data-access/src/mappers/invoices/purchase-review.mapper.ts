import {
  integer,
  list,
  nullableDateTime,
  nullableInteger,
  nullableText,
  record,
  text,
} from '../../validators/purchase-response';

import type { PurchaseInvoiceReview, PurchaseSupplierOption } from '@admin/purchasing/model';

export function mapPurchaseInvoiceReview(value: unknown): PurchaseInvoiceReview {
  const row = record(value, 'збережена перевірка');
  return {
    messageId: text(row['messageId'], 'id повідомлення'),
    supplierId: nullableInteger(row['supplierId'], 'постачальник'),
    supplierName: nullableText(row['supplierName'], 'назва постачальника'),
    reviewNote: nullableText(row['reviewNote'], 'примітка'),
    reviewVersion: integer(row['reviewVersion'], 'версія'),
    reviewedBy: nullableText(row['reviewedBy'], 'хто змінив'),
    reviewedAt: nullableDateTime(row['reviewedAt'], 'коли змінено'),
  };
}

export function mapPurchaseSupplierOptions(value: unknown): PurchaseSupplierOption[] {
  return list(value, 'постачальники').map((item) => {
    const row = record(item, 'постачальник');
    return { id: integer(row['id'], 'id постачальника', 1), name: text(row['name'], 'назва') };
  });
}
