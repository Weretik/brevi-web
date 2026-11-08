import { purchaseInvoiceStates } from '@admin/purchasing/model';

import { mapPurchaseDocument, mapPurchaseRecognitionAttempt } from './purchase-document.mapper';
import { mapPurchaseInvoicePayment, mapPurchasePaymentIssues } from './purchase-payment.mapper';
import {
  flag,
  integer,
  list,
  nullableDateTime,
  nullableInteger,
  nullableText,
  oneOf,
  record,
  text,
} from '../../validators/purchase-response';

import type {
  PurchaseInvoice,
  PurchaseInvoiceLink,
  PurchaseInvoicePage,
} from '@admin/purchasing/model';

function mapLink(value: unknown): PurchaseInvoiceLink {
  const row = record(value, 'посилання');
  return {
    id: text(row['id'], 'id файлу'),
    url: text(row['url'], 'адреса'),
    safe: flag(row['safe'], 'безпечне посилання'),
    document: mapPurchaseDocument(row['document']),
    recognition: mapPurchaseRecognitionAttempt(row['recognition']),
  };
}

export function mapPurchaseInvoice(value: unknown): PurchaseInvoice {
  const row = record(value, 'рахунок');
  return {
    messageId: text(row['messageId'], 'id повідомлення'),
    telegramKey: text(row['telegramKey'], 'Telegram id'),
    sourceUid: text(row['sourceUid'], 'UID'),
    rowNumber: integer(row['rowNumber'], 'рядок', 1),
    sourceRowCount: integer(row['sourceRowCount'], 'кількість рядків', 1),
    chatName: nullableText(row['chatName'], 'чат'),
    fromUser: nullableText(row['fromUser'], 'автор'),
    messageAt: nullableText(row['messageAt'], 'дата повідомлення'),
    text: text(row['text'], 'текст'),
    statusOriginal: text(row['statusOriginal'], 'статус'),
    markAt: nullableText(row['markAt'], 'дата відмітки'),
    markBy: nullableText(row['markBy'], 'хто відмітив'),
    markedPaid: flag(row['markedPaid'], 'оплата'),
    supplierId: nullableInteger(row['supplierId'], 'постачальник'),
    supplierName: nullableText(row['supplierName'], 'назва постачальника'),
    reviewNote: nullableText(row['reviewNote'], 'примітка'),
    reviewVersion: integer(row['reviewVersion'], 'версія'),
    reviewedBy: nullableText(row['reviewedBy'], 'хто змінив'),
    reviewedAt: nullableDateTime(row['reviewedAt'], 'коли змінено'),
    state: oneOf(row['state'], purchaseInvoiceStates, 'стан'),
    issues: list(row['issues'], 'проблеми').map((item) => text(item, 'проблема')),
    links: list(row['links'], 'посилання').map(mapLink),
    totalPayableMinor: nullableInteger(row['totalPayableMinor'], 'сума рахунку'),
    payments: list(row['payments'], 'оплати').map(mapPurchaseInvoicePayment),
    paymentIssues: mapPurchasePaymentIssues(row['paymentIssues']),
  };
}

export function mapPurchaseInvoicePage(value: unknown): PurchaseInvoicePage {
  const row = record(value, 'сторінка рахунків');
  return {
    items: list(row['items'], 'рахунки').map(mapPurchaseInvoice),
    total: integer(row['total'], 'кількість'),
    page: integer(row['page'], 'сторінка', 1),
    pageSize: integer(row['pageSize'], 'розмір сторінки', 1),
  };
}
