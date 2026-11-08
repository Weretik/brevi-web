import { financeAttachmentTypes } from '@admin/accounting/model';

import { dateTime, integer, list, oneOf, record, text } from '../validators/accounting-response';

import type { FinanceAttachment } from '@admin/accounting/model';

export function mapFinanceAttachment(value: unknown): FinanceAttachment {
  const row = record(value, 'файл');
  return {
    id: text(row['id'], 'id файлу'),
    transactionId: text(row['transactionId'], 'id операції'),
    fileName: text(row['fileName'], 'назва файлу'),
    contentType: oneOf(row['contentType'], financeAttachmentTypes, 'тип файлу'),
    sizeBytes: integer(row['sizeBytes'], 'розмір файлу'),
    createdBy: text(row['createdBy'], 'хто додав'),
    createdAt: dateTime(row['createdAt'], 'коли додано'),
  };
}

export const mapFinanceAttachments = (value: unknown): FinanceAttachment[] =>
  list(value, 'файли').map(mapFinanceAttachment);
