import type { PurchaseDocumentItem } from '../../entities/invoices/purchase-document';
import type {
  PurchaseInvoice,
  PurchaseInvoiceLink,
} from '../../entities/invoices/purchase-invoice';

/** The four marks of the register; the user asked for all four, «Розпізнано» included. */
export const purchaseInvoiceStatuses = ['Recognized', 'Warning', 'Error', 'NotRecognized'] as const;
export type PurchaseInvoiceStatus = (typeof purchaseInvoiceStatuses)[number];

export const purchaseInvoiceStatusLabels: Record<PurchaseInvoiceStatus, string> = {
  Recognized: 'Розпізнано',
  Warning: 'Попередження',
  Error: 'Помилка',
  NotRecognized: 'Не розпізнано',
};

export interface PurchaseStatusSummary {
  status: PurchaseInvoiceStatus;
  /** Reasons in plain words; empty for «Розпізнано». */
  notes: readonly string[];
}

const units = (value: string) => Number(value.replace(',', '.'));

/**
 * Discount of one line in whole percent when its sum is clearly below quantity × price (more than
 * 1 грн and 1 %), as the backend accepts it; null otherwise.
 */
export function purchaseLineDiscount(
  item: Pick<PurchaseDocumentItem, 'quantity' | 'price' | 'sum'>,
) {
  const expected = units(item.quantity) * units(item.price);
  const actual = units(item.sum);
  if (!Number.isFinite(expected) || !Number.isFinite(actual) || expected <= 0) return null;
  const gap = expected - actual;
  if (gap <= 1 || gap <= actual * 0.01) return null;
  return Math.round((gap / expected) * 1000) / 10;
}

/** State of one original: checked facts, a failed reading, or nothing yet. */
export function purchaseLinkStatus(link: PurchaseInvoiceLink): PurchaseStatusSummary {
  if (!link.safe)
    return { status: 'Warning', notes: ['Посилання не з Dropbox: відкрийте і перевірте вручну'] };
  if (link.document) return { status: 'Recognized', notes: [] };
  const attempt = link.recognition;
  if (!attempt) return { status: 'NotRecognized', notes: [] };
  if (attempt.result === 'Skipped')
    return {
      status: 'NotRecognized',
      notes: attempt.problems.length ? attempt.problems : ['Файл не PDF і не фото'],
    };
  return {
    status: 'Error',
    notes: attempt.problems.length ? attempt.problems : ['ШІ не зміг прочитати файл'],
  };
}

/** Problems of the sheet row itself, without the copies of recognition problems. */
export function purchaseSheetIssues(invoice: PurchaseInvoice): string[] {
  const copies = invoice.links.flatMap((link) => link.recognition?.problems ?? []);
  return invoice.issues.filter((issue) => !copies.some((problem) => issue.endsWith(problem)));
}

/** The worst state of the originals: an error first, then a file not read yet, then a warning. */
export function purchaseInvoiceStatus(invoice: PurchaseInvoice): PurchaseStatusSummary {
  const links = invoice.links.map(purchaseLinkStatus);
  const warnings = [
    ...purchaseSheetIssues(invoice),
    ...(invoice.supplierId !== null && invoice.supplierName === null
      ? ['Постачальника видалено з довідника']
      : []),
  ];
  const errors = links.filter((x) => x.status === 'Error');
  if (errors.length > 0) return { status: 'Error', notes: errors.flatMap((x) => x.notes) };
  if (links.length === 0)
    return { status: warnings.length ? 'Warning' : 'NotRecognized', notes: warnings };
  if (links.some((x) => x.status === 'NotRecognized'))
    return { status: 'NotRecognized', notes: [...links.flatMap((x) => x.notes), ...warnings] };
  const all = [...links.flatMap((x) => x.notes), ...warnings];
  return all.length > 0 ? { status: 'Warning', notes: all } : { status: 'Recognized', notes: [] };
}
