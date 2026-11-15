import { mapEmbroideryCalculation, toCalculateEmbroideryInput } from './embroidery.mapper';

import type {
  EmbroideryMaterialMode,
  EmbroideryMode,
  EmbroideryProgram,
  EmbroiderySavedCalculation,
  EmbroiderySavedPage,
  EmbroiderySavedSummary,
  EmbroiderySaveRequest,
} from '@admin/embroidery/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

const mapSummary = (value: Schemas['EmbroiderySavedSummaryResponse']): EmbroiderySavedSummary => ({
  id: value.id,
  number: value.number,
  name: value.name,
  customerPublicId: value.customerPublicId ?? null,
  customerName: value.customerName ?? null,
  mode: value.mode as EmbroideryMode,
  quantity: value.quantity,
  stitchesPerUnit: value.stitchesPerUnit,
  hoopLabel: value.hoopLabel,
  incomplete: value.incomplete,
  price: value.price ? { ...value.price } : null,
  createdAt: value.createdAt,
  createdByName: value.createdByName,
  mockup: value.mockup
    ? {
        mediaFileId: value.mockup.mediaFileId,
        fileName: value.mockup.fileName,
        url: value.mockup.url,
        thumbnailUrl: value.mockup.thumbnailUrl ?? null,
      }
    : null,
});

export const mapEmbroiderySavedPage = (
  value: Schemas['EmbroiderySavedPageResponse'],
): EmbroiderySavedPage => ({
  items: value.items.map(mapSummary),
  page: value.page,
  pageSize: value.pageSize,
  total: value.total,
});

export const mapEmbroiderySavedCalculation = (
  value: Schemas['EmbroiderySavedCalculationResponse'],
): EmbroiderySavedCalculation => ({
  summary: mapSummary(value.summary),
  input: {
    ...value.input,
    mode: value.input.mode as EmbroideryMode,
    program: value.input.program as EmbroideryProgram,
    materialMode: value.input.materialMode as EmbroideryMaterialMode,
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
): Schemas['SaveEmbroideryCalculationInput'] => ({
  name: request.name.trim() || null,
  customerPublicId: request.customerPublicId,
  calculation: toCalculateEmbroideryInput(request.calculation),
  category: request.category,
});
