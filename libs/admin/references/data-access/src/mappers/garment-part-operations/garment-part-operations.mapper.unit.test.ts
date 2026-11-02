import { describe, expect, it } from 'vitest';

import {
  mapGarmentPartOperations,
  mapOperationLabourRates,
} from './garment-part-operations.mapper';
import {
  parseGarmentPartOperationsResponse,
  parseSewingSettingsResponse,
} from '../../validators/garment-part-operations/garment-part-operations-response';

const row = {
  id: 1,
  code: 'OP-001',
  garmentPartName: 'Рукав',
  element: 'Рукав',
  variant: 'Прямий',
  name: 'Рукав куртки: прямий',
  min: 6,
  minutesPerProduct: false,
  normCheckedAt: '2026-08-30',
  isActive: true,
  notes: null,
};

describe('garment part operations mapping', () => {
  it('rejects malformed network rows', () => {
    expect(() => parseGarmentPartOperationsResponse({ id: 1 })).toThrow();
    expect(() => parseGarmentPartOperationsResponse([{ ...row, min: -1 }])).toThrow();
    expect(() => parseGarmentPartOperationsResponse([{ ...row, id: '1' }])).toThrow();
    expect(() => parseGarmentPartOperationsResponse([{ ...row, isActive: undefined }])).toThrow(
      'Некоректна операція.',
    );
  });

  it('maps empty and valid lists', () => {
    expect(mapGarmentPartOperations(parseGarmentPartOperationsResponse([]))).toEqual([]);
    expect(mapGarmentPartOperations(parseGarmentPartOperationsResponse([row]))).toEqual([row]);
  });

  it('derives the labour rates from the sewing settings', () => {
    const response = {
      settings: { monthlySalary: 15652.8, workDays: 22, shiftMinutes: 400, assemblyRate: 0.25 },
    };
    const rates = mapOperationLabourRates(parseSewingSettingsResponse(response));
    expect(rates.minuteCost).toBeCloseTo(1.7787, 4);
    expect(rates.assemblyRate).toBe(0.25);
    expect(() => parseSewingSettingsResponse({ settings: { workDays: 0 } })).toThrow();
  });
});
