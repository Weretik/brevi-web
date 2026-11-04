import { mapEmbroideryCalculation, toCalculateEmbroideryInput } from './embroidery.mapper';

import type {
  EmbroiderySavedCalculation,
  EmbroiderySavedPage,
  EmbroiderySavedSummary,
  EmbroiderySaveRequest,
} from '@admin/embroidery/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

const mapSummary = (value: Schemas['CrmEmbroiderySavedSummary']): EmbroiderySavedSummary => ({
  id: value.id,
  number: value.number,
  name: value.name,
  customerPublicId: value.customerPublicId ?? null,
  customerName: value.customerName ?? null,
  mode: value.mode,
  quantity: value.quantity,
  stitchesPerUnit: value.stitchesPerUnit,
  hoopLabel: value.hoopLabel,
  incomplete: value.incomplete,
  prices: value.prices.map((price) => ({ ...price })),
  createdAt: value.createdAt,
  createdByName: value.createdByName,
});

export const mapEmbroiderySavedPage = (
  value: Schemas['CrmEmbroiderySavedPage'],
): EmbroiderySavedPage => ({
  items: value.items.map(mapSummary),
  page: value.page,
  pageSize: value.pageSize,
  total: value.total,
});

export const mapEmbroiderySavedCalculation = (
  value: Schemas['CrmEmbroiderySavedCalculation'],
): EmbroiderySavedCalculation => ({
  summary: mapSummary(value.summary),
  input: {
    ...value.input,
    machineMinutes: value.input.machineMinutes ?? null,
    expenseOverrides: { ...(value.input.expenseOverrides ?? {}) },
  },
  result: mapEmbroideryCalculation(value.result),
  rates: value.rates
    ? {
        stitchRate: value.rates.stitchRate,
        rates: { ...value.rates.rates },
        markups: value.rates.markups.map((markup) => ({ ...markup })),
      }
    : null,
});

export const toSaveEmbroideryCalculationInput = (
  request: EmbroiderySaveRequest,
): Schemas['CrmSaveEmbroideryCalculationInput'] => ({
  name: request.name.trim() || null,
  customerPublicId: request.customerPublicId,
  calculation: toCalculateEmbroideryInput(request.calculation),
});
