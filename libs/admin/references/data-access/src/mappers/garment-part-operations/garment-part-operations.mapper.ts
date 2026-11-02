import type {
  GarmentPartOperationsResponse,
  SewingSettingsResponse,
} from '../../contracts/garment-part-operations/garment-part-operations-response';
import type { GarmentPartOperation, OperationLabourRates } from '@admin/references/model';

export function mapGarmentPartOperations(
  value: GarmentPartOperationsResponse,
): GarmentPartOperation[] {
  return value.map((row) => ({
    id: row.id,
    code: row.code,
    garmentPartName: row.garmentPartName,
    element: row.element,
    variant: row.variant,
    name: row.name,
    min: row.min,
    minutesPerProduct: row.minutesPerProduct,
    normCheckedAt: row.normCheckedAt,
    isActive: row.isActive,
    notes: row.notes,
  }));
}

/** Minute cost as the sewing calculator computes it: salary / (work days × shift minutes). */
export function mapOperationLabourRates({
  settings,
}: SewingSettingsResponse): OperationLabourRates {
  return {
    minuteCost: settings.monthlySalary / (settings.workDays * settings.shiftMinutes),
    assemblyRate: settings.assemblyRate,
  };
}
