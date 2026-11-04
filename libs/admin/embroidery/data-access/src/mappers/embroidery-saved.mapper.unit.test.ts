import { describe, expect, it } from 'vitest';

import {
  mapEmbroiderySavedCalculation,
  toSaveEmbroideryCalculationInput,
} from './embroidery-saved.mapper';
import { ensureEmbroiderySavedCalculation } from '../validators/embroidery-response';

import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

const input: Schemas['CrmCalculateEmbroideryInput'] = {
  mode: 'Garment',
  quantity: 50,
  stitchesPerUnit: 10_000,
  hoopId: '18',
  unitsPerHoop: 1,
  stabilizerLayers: 1,
  fabricLayers: 1,
  program: 'New',
  programMinutes: 60,
  machineMinutes: null,
  materialMode: 'UsedBlanks',
  expenseOverrides: null,
};

const saved: Schemas['CrmEmbroiderySavedCalculation'] = {
  summary: {
    id: 42,
    number: 'ВШ-0042',
    name: '',
    customerPublicId: null,
    customerName: null,
    mode: 'Garment',
    quantity: 50,
    stitchesPerUnit: 10_000,
    hoopLabel: '18 см',
    incomplete: true,
    prices: [{ name: 'Опт', unit: 81.54, total: 4077, repeatUnit: 69.64 }],
    createdAt: '2026-11-04T19:52:00Z',
    createdByName: 'Олена',
  },
  input,
  result: {
    error: null,
    missing: ['Клей'],
    hoopings: 50,
    fullHoopings: 50,
    lastHoopUnits: 1,
    freeInLastHoop: 0,
    prices: [{ name: 'Опт', markupPercent: null, unit: 81.54, total: 4077, repeatUnit: 69.64 }],
    cost: null,
    stabilizer: null,
    fabric: null,
  },
  rates: null,
};

describe('embroidery saved mapper', () => {
  it('maps a Manager record without rates and with empty overrides', () => {
    const mapped = mapEmbroiderySavedCalculation(ensureEmbroiderySavedCalculation(saved));

    expect(mapped.rates).toBeNull();
    expect(mapped.input.expenseOverrides).toEqual({});
    expect(mapped.summary.incomplete).toBe(true);
    expect(mapped.result.missing).toEqual(['Клей']);
  });

  it('sends an empty name as null', () => {
    const body = toSaveEmbroideryCalculationInput({
      name: '   ',
      customerPublicId: null,
      calculation: { ...input, machineMinutes: null, expenseOverrides: {} },
    });

    expect(body.name).toBeNull();
    expect(body.calculation.expenseOverrides).toBeNull();
  });

  it('rejects a broken response', () => {
    expect(() => ensureEmbroiderySavedCalculation({ summary: {} })).toThrow();
  });
});
