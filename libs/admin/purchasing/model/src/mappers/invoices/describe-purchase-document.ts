import type {
  PurchaseDocument,
  PurchaseRecognitionBatch,
} from '../../entities/invoices/purchase-document';

/** 2026-10-21 → 21.10.2026. */
export function formatPurchaseDocumentDate(value: string): string {
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day}.${month}.${year}` : value;
}

/** «8000.00» → «8 000,00 грн». The value is already exact; only the look changes. */
export function formatPurchaseMoney(value: string): string {
  const [whole = '0', fraction = ''] = value.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${grouped},${fraction.padEnd(2, '0')} грн`;
}

/** «Рахунок-фактура № 110776 від 21.10.2026». */
export function describePurchaseDocument(document: PurchaseDocument): string {
  return `${document.documentType} № ${document.documentNumber} від ${formatPurchaseDocumentDate(
    document.documentDate,
  )}`;
}

export const purchaseVatLabel = (document: PurchaseDocument): string =>
  document.vat === 'WithVat' ? 'З ПДВ' : 'Без ПДВ';

/** Progress line of «Розпізнати всі нові». */
export function describePurchaseRecognitionBatch(
  done: PurchaseRecognitionBatch,
  total: number,
): string {
  const processed = done.recognized + done.needsReview + done.failed + done.skipped;
  const parts = [`Розпізнано ${done.recognized} з ${total}`];
  if (done.needsReview > 0) parts.push(`потребують перевірки ${done.needsReview}`);
  if (done.failed > 0) parts.push(`не вдалося ${done.failed}`);
  if (done.skipped > 0) parts.push(`не PDF ${done.skipped}`);
  if (processed > 0) parts.push(`витрачено ${done.costUsd.toFixed(4)} $`);
  return parts.join(', ') + '.';
}
