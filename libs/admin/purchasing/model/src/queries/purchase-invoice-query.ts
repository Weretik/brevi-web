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
}
