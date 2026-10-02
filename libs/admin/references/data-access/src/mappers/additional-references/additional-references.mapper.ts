import type { AdditionalReference } from '@admin/references/model';
import type { operations } from '@admin/shared/contracts';

type AdditionalReferencesResponse =
  operations['getAdditionalReferences']['responses'][200]['content']['application/json'];

export function mapAdditionalReferences(value: unknown): AdditionalReference[] {
  if (!Array.isArray(value)) throw new Error('Некоректна відповідь списку додаткових довідників.');
  return value.map((item: unknown) => {
    if (!item || typeof item !== 'object')
      throw new Error('Некоректний запис додаткового довідника.');
    const row = item as Record<string, unknown>;
    if (
      !Number.isInteger(row['id']) ||
      (row['id'] as number) <= 0 ||
      typeof row['name'] !== 'string' ||
      typeof row['key'] !== 'string' ||
      typeof row['value'] !== 'number' ||
      !Number.isFinite(row['value']) ||
      typeof row['unit'] !== 'string' ||
      (row['description'] !== undefined &&
        row['description'] !== null &&
        typeof row['description'] !== 'string')
    )
      throw new Error('Некоректний запис додаткового довідника.');
    const validRow = row as AdditionalReferencesResponse[number];
    return {
      id: validRow.id,
      name: validRow.name,
      key: validRow.key,
      value: validRow.value,
      unit: validRow.unit,
      description: validRow.description ?? null,
    };
  });
}
