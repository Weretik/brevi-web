import { filterReferenceRows } from '../reference-lists/reference-activity-filter';

import type { Supplier } from '../../entities/suppliers/supplier';
import type { ReferenceActivityFilter } from '../reference-lists/reference-activity-filter';

export type SupplierActivityFilter = ReferenceActivityFilter;

/** Local search over the loaded list: name, contact, phone, email, purchases and tags. */
export function filterSuppliers(
  rows: Supplier[],
  search: string,
  activity: SupplierActivityFilter,
): Supplier[] {
  return filterReferenceRows(rows, search, activity, (row) => [
    row.name,
    row.contactPerson,
    row.phoneNumber,
    row.email,
    row.purchaseCategories,
    row.tags,
  ]);
}
