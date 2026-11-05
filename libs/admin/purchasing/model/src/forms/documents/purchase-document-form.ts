import type { PurchaseDocumentVat } from '../../entities/invoices/purchase-document';

/** One editable line; numbers stay text while typing so «12,5» or an empty cell can be shown. */
export interface PurchaseDocumentFormItem {
  key: string;
  name: string;
  quantity: string;
  unit: string;
  price: string;
  sum: string;
}

export interface PurchaseDocumentFormValues {
  documentType: string;
  documentNumber: string;
  /** YYYY-MM-DD, as a date input gives it. */
  documentDate: string;
  supplierName: string;
  vat: PurchaseDocumentVat;
  pricesIncludeVat: boolean;
  vatAmount: string;
  totalPayable: string;
  items: PurchaseDocumentFormItem[];
}

/** The file's identity from the template; the server checks it on save. */
export interface PurchaseDocumentIdentity {
  sourceUID: string;
  originalFileLink: string;
}

let nextKey = 0;
export const purchaseDocumentItemKey = () => `item-${++nextKey}`;

export const emptyPurchaseDocumentItem = (): PurchaseDocumentFormItem => ({
  key: purchaseDocumentItemKey(),
  name: '',
  quantity: '1',
  unit: '',
  price: '',
  sum: '',
});

const text = (value: unknown) =>
  typeof value === 'string' ? value : typeof value === 'number' ? String(value) : '';
const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

/** Fills the form from the server template: saved facts, else the last AI answer, else empty. */
export function purchaseDocumentFormOf(template: unknown): {
  values: PurchaseDocumentFormValues;
  identity: PurchaseDocumentIdentity;
} {
  const json = record(template);
  const items = Array.isArray(json['items']) ? json['items'] : [];
  return {
    identity: {
      sourceUID: text(json['sourceUID']),
      originalFileLink: text(json['originalFileLink']),
    },
    values: {
      documentType: text(json['documentType']),
      documentNumber: text(json['documentNumber']),
      documentDate: text(json['documentDate']),
      supplierName: text(json['supplierName']),
      vat: json['vat'] === 'with_vat' ? 'WithVat' : 'WithoutVat',
      pricesIncludeVat: json['pricesIncludeVat'] === true,
      vatAmount: text(json['vatAmount']),
      totalPayable: text(json['totalPayable']),
      items: (items.length ? items : [{}]).map((item) => {
        const row = record(item);
        return {
          key: purchaseDocumentItemKey(),
          name: text(row['name']),
          quantity: text(row['quantity']) || '1',
          unit: text(row['unit']),
          price: text(row['price']),
          sum: text(row['sum']),
        };
      }),
    },
  };
}

/** «12,50 » → «12.50»: the server reads numbers with a dot and no spaces. */
export const purchaseNumberText = (value: string) =>
  value.trim().replace(/\s/g, '').replace(',', '.');

/** The JSON the server expects, with the file's identity. */
export function purchaseDocumentJsonOf(
  values: PurchaseDocumentFormValues,
  identity: PurchaseDocumentIdentity,
) {
  const withVat = values.vat === 'WithVat';
  return {
    sourceUID: identity.sourceUID,
    originalFileLink: identity.originalFileLink,
    documentType: values.documentType.trim(),
    documentNumber: values.documentNumber.trim(),
    documentDate: values.documentDate.trim(),
    supplierName: values.supplierName.trim(),
    vat: withVat ? 'with_vat' : 'without_vat',
    pricesIncludeVat: withVat && values.pricesIncludeVat,
    items: values.items.map((item) => ({
      name: item.name.trim(),
      quantity: purchaseNumberText(item.quantity),
      unit: item.unit.trim() || null,
      price: purchaseNumberText(item.price),
      sum: purchaseNumberText(item.sum),
    })),
    vatAmount: withVat ? purchaseNumberText(values.vatAmount) : null,
    totalPayable: purchaseNumberText(values.totalPayable),
  };
}
