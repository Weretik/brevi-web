import type { FabricsResponse } from '../../contracts/fabrics/fabrics-response';
import type { Fabric } from '@admin/references/model';

export function mapFabrics(value: FabricsResponse): Fabric[] {
  return value.map((row) => ({
    id: row.id,
    code: row.code,
    name: row.name,
    nameRu: row.nameRu,
    providerName: row.providerName,
    composition: row.composition,
    compositionRu: row.compositionRu,
    density: row.density,
    price: row.price,
    priceUpdatedAt: row.priceUpdatedAt,
    isActive: row.isActive,
    comment: row.comment,
    proposalDescription: row.proposalDescription,
  }));
}
