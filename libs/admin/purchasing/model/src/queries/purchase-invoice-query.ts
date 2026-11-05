import type { PurchaseDocumentVat } from '../entities/invoices/purchase-document';

export const purchaseInvoiceFilters = [
  'All',
  'NeedsReview',
  'WithoutSupplier',
  'NotRecognized',
] as const;
export type PurchaseInvoiceFilter = (typeof purchaseInvoiceFilters)[number];

export const purchaseInvoicePageSizes = [25, 50, 100] as const;
export const defaultPurchaseInvoicePageSize = 50;

export interface PurchaseInvoiceQuery {
  page: number;
  pageSize: number;
  search: string;
  filter: PurchaseInvoiceFilter;
  /** The supplier card tab «Рахунки на закупку»: only invoices linked to this supplier. */
  supplierId?: number;
  /** yyyy-mm-dd: invoice date of the checked facts, from and to inclusive. */
  documentFrom?: string;
  documentTo?: string;
  vat?: PurchaseDocumentVat;
}
