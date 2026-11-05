import { purchaseNumberText } from '../../forms/documents/purchase-document-form';
import { purchaseLineDiscount } from '../../mappers/invoices/purchase-invoice-status';

import type { PurchaseDocumentFormValues } from '../../forms/documents/purchase-document-form';

export type PurchaseDocumentField =
  | 'documentType'
  | 'documentNumber'
  | 'documentDate'
  | 'supplierName'
  | 'vatAmount'
  | 'totalPayable'
  | 'items';

export interface PurchaseDocumentCheck {
  errors: Partial<Record<PurchaseDocumentField, string>>;
  /** Reason per line key. */
  itemErrors: Record<string, string>;
  /** Discount in percent per line key, accepted when the totals add up. */
  discounts: Record<string, number>;
  /** Σ line sums (+ VAT on top) in kopecks; null while a sum is not a number. */
  linesKopecks: number | null;
  /** The positions add up to «До оплати» to the kopeck. */
  balanced: boolean;
  valid: boolean;
}

const money = /^\d{1,12}(\.\d{1,2})?$/;
const decimal = /^\d{1,12}(\.\d{1,4})?$/;

/** «8 000,5» → 800050; null when it is not money. */
export function purchaseKopecks(value: string): number | null {
  const text = purchaseNumberText(value);
  if (!money.test(text)) return null;
  const [whole = '0', fraction = ''] = text.split('.');
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
}

export const formatPurchaseKopecks = (kopecks: number) =>
  `${Math.floor(kopecks / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')},${String(kopecks % 100).padStart(2, '0')}`;

/** The same rules as the backend, so «Зберегти» is offered only when the server will accept it. */
export function checkPurchaseDocument(values: PurchaseDocumentFormValues): PurchaseDocumentCheck {
  const errors: PurchaseDocumentCheck['errors'] = {};
  const itemErrors: Record<string, string> = {};
  const discounts: Record<string, number> = {};
  if (!values.documentType.trim()) errors.documentType = 'Вкажіть вид документа';
  if (!values.documentNumber.trim()) errors.documentNumber = 'Вкажіть номер';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.documentDate.trim())) errors.documentDate = 'Вкажіть дату';
  if (!values.supplierName.trim()) errors.supplierName = 'Вкажіть постачальника';
  if (values.items.length === 0) errors.items = 'Додайте хоча б одну позицію';

  let lines: number | null = 0;
  for (const item of values.items) {
    const sum = purchaseKopecks(item.sum);
    if (!item.name.trim()) itemErrors[item.key] = 'Вкажіть назву';
    else if (
      !decimal.test(purchaseNumberText(item.quantity)) ||
      Number(purchaseNumberText(item.quantity)) <= 0
    )
      itemErrors[item.key] = 'Кількість — додатне число';
    // An empty price is fine: the server takes it as sum ÷ quantity (invoices without a «Ціна» column).
    else if (item.price.trim() && !decimal.test(purchaseNumberText(item.price)))
      itemErrors[item.key] = 'Ціна — число';
    else if (sum === null) itemErrors[item.key] = 'Сума — число до копійок';
    lines = sum === null || lines === null ? null : lines + sum;
  }

  const withVat = values.vat === 'WithVat';
  const vat = withVat ? purchaseKopecks(values.vatAmount) : 0;
  if (withVat && vat === null) errors.vatAmount = 'Вкажіть суму ПДВ';
  const total = purchaseKopecks(values.totalPayable);
  if (total === null) errors.totalPayable = 'Вкажіть суму до оплати';
  const linesKopecks =
    lines === null || vat === null
      ? null
      : withVat && !values.pricesIncludeVat
        ? lines + vat
        : lines;
  const balanced = linesKopecks !== null && total !== null && linesKopecks === total;

  for (const item of values.items) {
    if (itemErrors[item.key] || !item.price.trim()) continue;
    const quantity = Number(purchaseNumberText(item.quantity));
    const price = Number(purchaseNumberText(item.price));
    const sum = Number(purchaseNumberText(item.sum));
    const expected = quantity * price;
    const gap = Math.abs(expected - sum);
    if (gap <= 1 || gap <= sum * 0.01) continue;
    const discount = purchaseLineDiscount({
      quantity: item.quantity,
      price: item.price,
      sum: item.sum,
    });
    if (balanced && sum < expected && sum >= expected * 0.7 && discount !== null)
      discounts[item.key] = discount;
    else
      itemErrors[item.key] = `Кількість × ціна = ${expected.toFixed(2)}, а сума ${sum.toFixed(2)}`;
  }

  return {
    errors,
    itemErrors,
    discounts,
    linesKopecks,
    balanced,
    valid: Object.keys(errors).length === 0 && Object.keys(itemErrors).length === 0 && balanced,
  };
}
