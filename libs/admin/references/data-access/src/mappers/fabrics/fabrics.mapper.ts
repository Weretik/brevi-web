import type { Fabric } from '@admin/references/model';
import type { operations } from '@admin/shared/contracts';

type FabricResponse = operations['getFabrics']['responses'][200]['content']['application/json'];

export function mapFabrics(value: unknown): Fabric[] {
  if (!Array.isArray(value)) throw new Error('Некоректна відповідь списку тканини.');
  return value.map((item: unknown) => {
    if (!item || typeof item !== 'object') throw new Error('Некоректний запис тканини.');
    const row = item as Record<string, unknown>;
    if (
      !Number.isInteger(row['id']) ||
      (row['id'] as number) <= 0 ||
      typeof row['name'] !== 'string' ||
      typeof row['providerName'] !== 'string' ||
      typeof row['price'] !== 'number' ||
      !Number.isFinite(row['price']) ||
      (row['price'] as number) < 0
    )
      throw new Error('Некоректний запис тканини.');
    const validRow: FabricResponse[number] = row as FabricResponse[number];
    return {
      id: validRow.id,
      name: validRow.name,
      providerName: validRow.providerName,
      price: validRow.price,
    };
  });
}
