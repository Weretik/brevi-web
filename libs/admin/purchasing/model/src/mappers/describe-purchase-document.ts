import type { PurchaseDocument, PurchaseRecognitionStart } from '../entities/purchase-document';

/** 2026-10-21 → 21.10.2026. */
export function formatPurchaseDocumentDate(value: string): string {
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day}.${month}.${year}` : value;
}

const kyivTime = new Intl.DateTimeFormat('uk-UA', {
  timeZone: 'Europe/Kyiv',
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

/**
 * The sheet's DateTime cell for people: an ISO time «2026-11-04T21:39:54.000Z» → «04.11.26 23:39»
 * in Kyiv; anything else (already human, or broken) stays as written.
 */
export function formatPurchaseMessageAt(value: string | null): string {
  if (!value) return '—';
  if (!/^\d{4}-\d{2}-\d{2}T/.test(value)) return value;
  const time = new Date(value);
  return Number.isNaN(time.getTime()) ? value : kyivTime.format(time).replace(',', '');
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

/** What «Розпізнати всі нові» tells the accountant: the work runs in «Фонові задачі», not in the page. */
export function describePurchaseRecognitionStart(start: PurchaseRecognitionStart): string {
  return start.started
    ? `Розпізнавання нових оригіналів (${start.waiting}) запущено у фоні: почнеться протягом хвилини. ` +
        'Документи з’являтимуться в списку, підсумок — на сторінці «Фонові задачі».'
    : 'Нових оригіналів для розпізнавання немає.';
}
