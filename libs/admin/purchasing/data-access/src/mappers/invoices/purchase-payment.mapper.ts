import {
  flag,
  integer,
  list,
  nullableInteger,
  nullableText,
  record,
  text,
} from '../../validators/purchase-response';

import type {
  PurchaseInvoicePayment,
  PurchaseInvoicePayments,
  PurchasePaymentCandidate,
} from '@admin/purchasing/model';

/** Kopecks of «Бухгалтерія» may be negative only in theory; the payments are expenses. */
const minor = (value: unknown, what: string) => nullableInteger(value, what);

export function mapPurchaseInvoicePayment(value: unknown): PurchaseInvoicePayment {
  const row = record(value, 'оплата');
  return {
    transactionId: text(row['transactionId'], 'id операції'),
    date: nullableText(row['date'], 'дата оплати'),
    amountMinor: minor(row['amountMinor'], 'сума оплати'),
    currency: nullableText(row['currency'], 'валюта'),
    accountName: nullableText(row['accountName'], 'рахунок'),
    description: nullableText(row['description'], 'опис'),
    counterpartyName: nullableText(row['counterpartyName'], 'контрагент'),
    missing: flag(row['missing'], 'не знайдено'),
    voided: flag(row['voided'], 'анульовано'),
    linkedBy: text(row['linkedBy'], 'хто привʼязав'),
    linkedAt: text(row['linkedAt'], 'коли привʼязано'),
  };
}

export function mapPurchasePaymentCandidates(value: unknown): PurchasePaymentCandidate[] {
  return list(value, 'витрати').map((item) => {
    const row = record(item, 'витрата');
    return {
      transactionId: text(row['transactionId'], 'id операції'),
      date: text(row['date'], 'дата'),
      amountMinor: integer(row['amountMinor'], 'сума'),
      currency: text(row['currency'], 'валюта'),
      accountName: text(row['accountName'], 'рахунок'),
      description: typeof row['description'] === 'string' ? row['description'] : '',
      counterpartyName: nullableText(row['counterpartyName'], 'контрагент'),
      sameAmount: flag(row['sameAmount'], 'та сама сума'),
    };
  });
}

export const mapPurchasePaymentIssues = (value: unknown): string[] =>
  list(value, 'проблеми оплати').map((item) => text(item, 'проблема оплати'));

export function mapPurchaseInvoicePayments(value: unknown): PurchaseInvoicePayments {
  const row = record(value, 'оплати рахунку');
  return {
    messageId: text(row['messageId'], 'id повідомлення'),
    reviewVersion: integer(row['reviewVersion'], 'версія'),
    totalPayableMinor: minor(row['totalPayableMinor'], 'сума рахунку'),
    payments: list(row['payments'], 'оплати').map(mapPurchaseInvoicePayment),
    paymentIssues: mapPurchasePaymentIssues(row['paymentIssues']),
  };
}
