import type { FabricsResponse } from '../../contracts/fabrics/fabrics-response';

const nullableText = [
  'code',
  'nameRu',
  'composition',
  'compositionRu',
  'density',
  'priceUpdatedAt',
  'comment',
  'proposalDescription',
];

export function parseFabricsResponse(value: unknown): FabricsResponse {
  if (!Array.isArray(value)) throw new Error('Некоректна відповідь списку тканин.');
  for (const item of value) {
    const row = item as Record<string, unknown> | null;
    if (
      !row ||
      typeof row !== 'object' ||
      !Number.isInteger(row['id']) ||
      (row['id'] as number) <= 0 ||
      typeof row['name'] !== 'string' ||
      typeof row['providerName'] !== 'string' ||
      typeof row['price'] !== 'number' ||
      !Number.isFinite(row['price']) ||
      (row['price'] as number) < 0 ||
      typeof row['isActive'] !== 'boolean' ||
      nullableText.some((field) => row[field] !== null && typeof row[field] !== 'string')
    ) {
      throw new Error('Некоректний запис тканини.');
    }
  }
  return value as FabricsResponse;
}
