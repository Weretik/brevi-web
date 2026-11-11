import type { FabricColorsResponse } from '../../contracts/fabric-colors/fabric-colors-response';
import type { FabricColor } from '@admin/references/model';

export function mapFabricColors(value: FabricColorsResponse): FabricColor[] {
  return value.map((row) => ({
    id: row.id,
    name: row.name,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
  }));
}
