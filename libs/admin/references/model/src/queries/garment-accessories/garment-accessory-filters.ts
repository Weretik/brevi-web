import { filterReferenceRows } from '../reference-lists/reference-activity-filter';
import { matchesReferenceSupplier } from '../reference-lists/reference-supplier-filter';

import type { GarmentAccessory } from '../../entities/garment-accessories/garment-accessory';
import type { ReferenceActivityFilter } from '../reference-lists/reference-activity-filter';
import type { ReferenceSupplierFilter } from '../reference-lists/reference-supplier-filter';

/** Local search: code, name and supplier; then the supplier filter. */
export function filterGarmentAccessories(
  rows: GarmentAccessory[],
  search: string,
  activity: ReferenceActivityFilter,
  supplier: ReferenceSupplierFilter = null,
): GarmentAccessory[] {
  return filterReferenceRows(rows, search, activity, (row) => [
    row.code,
    row.name,
    row.supplierName,
  ]).filter((row) => matchesReferenceSupplier(row.supplierName, supplier));
}
