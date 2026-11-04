import type {
  EmbroideryCalculation,
  EmbroideryCalculationRequest,
  EmbroideryCut,
  EmbroideryFormSetup,
  EmbroiderySettings,
  EmbroiderySettingsContent,
} from '@admin/embroidery/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

export const mapEmbroideryForm = (value: Schemas['CrmEmbroideryForm']): EmbroideryFormSetup => ({
  seesCost: value.seesCost,
  hoops: value.hoops.map((hoop) => ({
    id: hoop.id,
    label: hoop.label,
    blankWidthCm: hoop.blankWidthCm,
    blankLengthCm: hoop.blankLengthCm,
  })),
  expenses: value.expenses.map((expense) => ({
    id: expense.id,
    name: expense.name,
    basis: expense.basis,
    mode: expense.mode,
    enabled: expense.enabled,
    hasRate: expense.hasRate,
  })),
  markupNames: [...value.markupNames],
  settingsUpdatedAt: value.settingsUpdatedAt ?? null,
});

export const toCalculateEmbroideryInput = (
  request: EmbroideryCalculationRequest,
): Schemas['CrmCalculateEmbroideryInput'] => ({
  mode: request.mode,
  quantity: request.quantity,
  stitchesPerUnit: request.stitchesPerUnit,
  hoopId: request.hoopId,
  unitsPerHoop: request.unitsPerHoop,
  stabilizerLayers: request.stabilizerLayers,
  fabricLayers: request.fabricLayers,
  program: request.program,
  programMinutes: request.programMinutes,
  machineMinutes: request.machineMinutes,
  materialMode: request.materialMode,
  expenseOverrides: Object.keys(request.expenseOverrides).length
    ? { ...request.expenseOverrides }
    : null,
});

const cut = (value: Schemas['CrmEmbroideryCut'] | null | undefined): EmbroideryCut | null =>
  value
    ? {
        blankWidthCm: value.blankWidthCm,
        blankLengthCm: value.blankLengthCm,
        rollWidthCm: value.rollWidthCm,
        blanks: value.blanks,
        across: value.across,
        rows: value.rows,
        produced: value.produced,
        spare: value.spare,
        sideWasteCm: value.sideWasteCm,
        cutMetres: value.cutMetres,
        blankCost: value.blankCost ?? null,
        wholeCost: value.wholeCost ?? null,
        charged: value.charged ?? null,
      }
    : null;

export const mapEmbroideryCalculation = (
  value: Schemas['CrmEmbroideryCalculation'],
): EmbroideryCalculation => ({
  error: value.error ?? null,
  missing: [...value.missing],
  hoopings: value.hoopings,
  fullHoopings: value.fullHoopings,
  lastHoopUnits: value.lastHoopUnits,
  freeInLastHoop: value.freeInLastHoop,
  prices: value.prices.map((price) => ({
    name: price.name,
    markupPercent: price.markupPercent ?? null,
    unit: price.unit,
    total: price.total,
    repeatUnit: price.repeatUnit,
  })),
  cost: value.cost
    ? {
        total: value.cost.total,
        perUnit: value.cost.perUnit,
        rows: value.cost.rows.map((row) => ({
          kind: row.kind,
          name: row.name,
          basis: row.basis ?? null,
          quantity: row.quantity,
          rate: row.rate ?? null,
          amount: row.amount,
          perUnit: row.perUnit,
        })),
      }
    : null,
  stabilizer: cut(value.stabilizer),
  fabric: cut(value.fabric),
});

const content = (value: Schemas['CrmEmbroiderySettings']): EmbroiderySettingsContent => ({
  rates: { ...value.rates },
  markups: value.markups.map((markup) => ({ name: markup.name, percent: markup.percent })),
  stabilizer: { ...value.stabilizer },
  fabric: { ...value.fabric },
  fabricIncreasePercent: value.fabricIncreasePercent,
  hoops: value.hoops.map((hoop) => ({ ...hoop, glueRate: hoop.glueRate ?? null })),
  expenses: value.expenses.map((expense) => ({ ...expense, rate: expense.rate ?? null })),
});

export const mapEmbroiderySettings = (
  value: Schemas['CrmEmbroiderySettings'],
): EmbroiderySettings => ({
  ...content(value),
  version: value.version,
  updatedByName: value.updatedByName ?? null,
  updatedAt: value.updatedAt ?? null,
  stitchRate: {
    value: value.stitchRate.value ?? null,
    updatedOn: value.stitchRate.updatedOn ?? null,
  },
});

export const toSaveEmbroiderySettingsInput = (
  version: number,
  settings: EmbroiderySettingsContent,
): Schemas['CrmSaveEmbroiderySettingsInput'] => ({
  version,
  rates: { ...settings.rates },
  markups: settings.markups.map((markup) => ({ ...markup })),
  stabilizer: { ...settings.stabilizer },
  fabric: { ...settings.fabric },
  fabricIncreasePercent: settings.fabricIncreasePercent,
  hoops: settings.hoops.map((hoop) => ({ ...hoop })),
  expenses: settings.expenses.map((expense) => ({ ...expense })),
});
