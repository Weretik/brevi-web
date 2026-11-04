import { describe, expect, it } from 'vitest';

import {
  mapEmbroideryCalculation,
  mapEmbroiderySettings,
  toCalculateEmbroideryInput,
} from './embroidery.mapper';
import { ensureEmbroideryCalculation } from '../validators/embroidery-response';

import type { EmbroideryCalculationRequest } from '@admin/embroidery/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

const request: EmbroideryCalculationRequest = {
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
  expenseOverrides: {},
};

const managerCalculation: Schemas['CrmEmbroideryCalculation'] = {
  error: null,
  missing: [],
  hoopings: 50,
  fullHoopings: 50,
  lastHoopUnits: 1,
  freeInLastHoop: 0,
  prices: [{ name: 'Опт', markupPercent: null, unit: 81.54, total: 4077, repeatUnit: 69.64 }],
  cost: null,
  stabilizer: null,
  fabric: null,
};

describe('embroidery mappers', () => {
  it('sends no overrides when nothing was ticked differently', () => {
    expect(toCalculateEmbroideryInput(request).expenseOverrides).toBeNull();
    expect(
      toCalculateEmbroideryInput({ ...request, expenseOverrides: { glue: false } })
        .expenseOverrides,
    ).toEqual({ glue: false });
  });

  it('keeps a Manager calculation without cost', () => {
    const result = mapEmbroideryCalculation(ensureEmbroideryCalculation(managerCalculation));
    expect(result.cost).toBeNull();
    expect(result.prices[0]).toEqual({
      name: 'Опт',
      markupPercent: null,
      unit: 81.54,
      total: 4077,
      repeatUnit: 69.64,
    });
  });

  it('rejects a response without prices', () => {
    expect(() => ensureEmbroideryCalculation({ ...managerCalculation, prices: null })).toThrow();
  });

  it('keeps an empty rate apart from zero', () => {
    const settings = mapEmbroiderySettings({
      version: 0,
      updatedByName: null,
      updatedAt: null,
      stitchRate: { value: 1, updatedOn: null },
      rates: { threadRate: 0.3, hoopingRate: 10, programHourRate: 300, taxPercent: 24 },
      markups: [],
      stabilizer: { pricePerMetre: 20, widthCm: 90 },
      fabric: { pricePerMetre: 80, widthCm: 150 },
      fabricIncreasePercent: 40,
      hoops: [{ id: '15', label: '15 см', blankWidthCm: 18, blankLengthCm: 18, glueRate: null }],
      expenses: [
        { id: 'a', name: 'А', basis: 'Unit', rate: null, enabled: true, mode: 'All' },
        { id: 'b', name: 'Б', basis: 'Unit', rate: 0, enabled: true, mode: 'All' },
      ],
    });
    expect(settings.expenses.map((expense) => expense.rate)).toEqual([null, 0]);
    expect(settings.hoops[0]?.glueRate).toBeNull();
  });
});
