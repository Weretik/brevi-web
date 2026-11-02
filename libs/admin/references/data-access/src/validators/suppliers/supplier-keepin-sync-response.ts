import type { SupplierKeepinSyncResponse } from '../../contracts/suppliers/supplier-keepin-sync-response';

export function parseSupplierKeepinSyncResponse(value: unknown): SupplierKeepinSyncResponse {
  const row = value as Record<string, unknown> | null;
  const counts = ['received', 'created', 'linked', 'updated'];
  if (
    !row ||
    typeof row !== 'object' ||
    counts.some((field) => !Number.isInteger(row[field])) ||
    !Array.isArray(row['missingInKeepinCrm']) ||
    row['missingInKeepinCrm'].some((name) => typeof name !== 'string') ||
    typeof row['syncedAt'] !== 'string'
  ) {
    throw new Error('Некоректна відповідь оновлення з KeepinCRM.');
  }
  return row as SupplierKeepinSyncResponse;
}
