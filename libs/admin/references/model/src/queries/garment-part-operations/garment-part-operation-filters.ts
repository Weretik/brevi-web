import { filterReferenceRows } from '../reference-lists/reference-activity-filter';
import { matchesReferenceSupplier } from '../reference-lists/reference-supplier-filter';

import type { GarmentPartOperation } from '../../entities/garment-part-operations/garment-part-operation';
import type { ReferenceActivityFilter } from '../reference-lists/reference-activity-filter';
import type { ReferenceSupplierFilter } from '../reference-lists/reference-supplier-filter';

/** Local search: code, group, element, variant and name; then the group filter. */
export function filterGarmentPartOperations(
  rows: GarmentPartOperation[],
  search: string,
  activity: ReferenceActivityFilter,
  group: ReferenceSupplierFilter = null,
): GarmentPartOperation[] {
  return filterReferenceRows(rows, search, activity, (row) => [
    row.code,
    row.garmentPartName,
    row.element,
    row.variant,
    row.name,
  ]).filter((row) => matchesReferenceSupplier(row.garmentPartName, group));
}
