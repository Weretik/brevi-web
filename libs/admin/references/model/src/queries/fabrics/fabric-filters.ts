import { filterReferenceRows } from '../reference-lists/reference-activity-filter';
import { matchesReferenceSupplier } from '../reference-lists/reference-supplier-filter';

import type { Fabric } from '../../entities/fabrics/fabric';
import type { ReferenceActivityFilter } from '../reference-lists/reference-activity-filter';
import type { ReferenceSupplierFilter } from '../reference-lists/reference-supplier-filter';

/** Local search: code, UA/RU name, supplier and composition; then the supplier filter. */
export function filterFabrics(
  rows: Fabric[],
  search: string,
  activity: ReferenceActivityFilter,
  supplier: ReferenceSupplierFilter = null,
): Fabric[] {
  return filterReferenceRows(rows, search, activity, (row) => [
    row.code,
    row.name,
    row.nameRu,
    row.providerName,
    row.composition,
    row.compositionRu,
  ]).filter((row) => matchesReferenceSupplier(row.providerName, supplier));
}
