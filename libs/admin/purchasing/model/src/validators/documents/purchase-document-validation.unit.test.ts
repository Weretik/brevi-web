import { describe, expect, it } from 'vitest';

import { checkPurchaseDocument, formatPurchaseKopecks } from './purchase-document-validation';
import {
  purchaseDocumentFormOf,
  purchaseDocumentJsonOf,
} from '../../forms/documents/purchase-document-form';

const template = {
  sourceUID: '42',
  originalFileLink: 'https://www.dropbox.com/s/a.pdf',
  documentType: 'Рахунок на оплату',
  documentNumber: '1542',
  documentDate: '2026-11-03',
  supplierName: 'ТОВ Захист-Про',
  vat: 'without_vat',
  pricesIncludeVat: false,
  items: [
    { name: 'Рукавиці', quantity: '10', unit: 'пар', price: '47.70', sum: '453.15' },
    { name: 'Рукавиці ПВХ', quantity: '20', unit: 'пар', price: '47.70', sum: '906.30' },
  ],
  vatAmount: null,
  totalPayable: '1359.45',
};

describe('«Виправити» form', () => {
  it('accepts discounted lines when the totals add up and writes the server JSON', () => {
    const { values, identity } = purchaseDocumentFormOf(template);
    const check = checkPurchaseDocument(values);
    expect(check.valid).toBe(true);
    expect(Object.values(check.discounts)).toEqual([5, 5]);
    expect(formatPurchaseKopecks(check.linesKopecks!)).toBe('1 359,45');

    const edited = { ...values, totalPayable: '1 359,45', vat: 'WithVat' as const, vatAmount: '0' };
    expect(purchaseDocumentJsonOf(edited, identity)).toMatchObject({
      sourceUID: '42',
      vat: 'with_vat',
      vatAmount: '0',
      totalPayable: '1359.45',
      items: [{ name: 'Рукавиці', quantity: '10', unit: 'пар', price: '47.70', sum: '453.15' }, {}],
    });
  });

  it('marks the lines and the total when they do not add up', () => {
    const { values } = purchaseDocumentFormOf({ ...template, totalPayable: '1431.00' });
    const check = checkPurchaseDocument(values);
    expect(check.valid).toBe(false);
    expect(check.balanced).toBe(false);
    expect(Object.values(check.itemErrors)).toEqual([
      'Кількість × ціна = 477.00, а сума 453.15',
      'Кількість × ціна = 954.00, а сума 906.30',
    ]);
  });

  it('asks for the missing fields of an empty template', () => {
    const { values } = purchaseDocumentFormOf({});
    const check = checkPurchaseDocument(values);
    expect(check.errors).toMatchObject({
      documentNumber: 'Вкажіть номер',
      documentDate: 'Вкажіть дату',
      totalPayable: 'Вкажіть суму до оплати',
    });
    expect(Object.values(check.itemErrors)).toEqual(['Вкажіть назву']);
  });
});
