import type { FabricColorsResponse } from '../../contracts/fabric-colors/fabric-colors-response';

export function parseFabricColorsResponse(value: unknown): FabricColorsResponse {
  if (!Array.isArray(value)) throw new Error('Некоректна відповідь списку кольорів.');
  for (const item of value) {
    const row = (item ?? {}) as Record<string, unknown>;
    if (
      !Number.isInteger(row['id']) ||
      (row['id'] as number) <= 0 ||
      typeof row['name'] !== 'string' ||
      typeof row['isActive'] !== 'boolean' ||
      !Number.isInteger(row['sortOrder'])
    )
      throw new Error('Некоректний запис кольору.');
  }
  return value as FabricColorsResponse;
}
