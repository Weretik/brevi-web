import { filterReferenceRows } from '../reference-lists/reference-activity-filter';

import type { Fabric } from '../../entities/fabrics/fabric';
import type { ReferenceActivityFilter } from '../reference-lists/reference-activity-filter';

/** Local search: code, UA/RU name, supplier and composition. */
export function filterFabrics(
  rows: Fabric[],
  search: string,
  activity: ReferenceActivityFilter,
): Fabric[] {
  return filterReferenceRows(rows, search, activity, (row) => [
    row.code,
    row.name,
    row.nameRu,
    row.providerName,
    row.composition,
    row.compositionRu,
  ]);
}
