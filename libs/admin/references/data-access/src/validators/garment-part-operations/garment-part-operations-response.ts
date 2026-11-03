import type {
  GarmentPartOperationsResponse,
  SewingSettingsResponse,
} from '../../contracts/garment-part-operations/garment-part-operations-response';

const finite = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

export function parseGarmentPartOperationsResponse(value: unknown): GarmentPartOperationsResponse {
  if (!Array.isArray(value)) throw new Error('Некоректна відповідь списку операцій.');
  for (const item of value) {
    const row = item as Record<string, unknown> | null;
    if (
      !row ||
      typeof row !== 'object' ||
      !Number.isInteger(row['id']) ||
      (row['id'] as number) <= 0 ||
      typeof row['garmentPartName'] !== 'string' ||
      typeof row['name'] !== 'string' ||
      !finite(row['min']) ||
      row['min'] < 0 ||
      typeof row['minutesPerProduct'] !== 'boolean' ||
      typeof row['isActive'] !== 'boolean' ||
      ['code', 'element', 'variant', 'notes'].some(
        (field) => row[field] !== null && typeof row[field] !== 'string',
      )
    ) {
      throw new Error('Некоректна операція.');
    }
  }
  return value as GarmentPartOperationsResponse;
}

export function parseSewingSettingsResponse(value: unknown): SewingSettingsResponse {
  const settings = (value as { settings?: Record<string, unknown> } | null)?.settings;
  if (
    !settings ||
    !finite(settings['monthlySalary']) ||
    !finite(settings['workDays']) ||
    !finite(settings['shiftMinutes']) ||
    !finite(settings['assemblyRate']) ||
    settings['workDays'] <= 0 ||
    settings['shiftMinutes'] <= 0
  )
    throw new Error('Некоректні налаштування ціноутворення пошиву.');
  return value as SewingSettingsResponse;
}
