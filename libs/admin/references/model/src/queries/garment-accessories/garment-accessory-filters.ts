import { filterReferenceRows } from '../reference-lists/reference-activity-filter';

import type { GarmentAccessory } from '../../entities/garment-accessories/garment-accessory';
import type { ReferenceActivityFilter } from '../reference-lists/reference-activity-filter';

/** Local search: code, name and supplier. */
export function filterGarmentAccessories(
  rows: GarmentAccessory[],
  search: string,
  activity: ReferenceActivityFilter,
): GarmentAccessory[] {
  return filterReferenceRows(rows, search, activity, (row) => [
    row.code,
    row.name,
    row.supplierName,
  ]);
}
