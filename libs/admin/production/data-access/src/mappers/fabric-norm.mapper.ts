import {
  boolean,
  list,
  nonEmptyText,
  nullableDateTime,
  nullableInteger,
  nullableNumber,
  nullableText,
  record,
} from '../validators/production-response';

import type { FabricNormRow, FabricNormValues } from '@admin/production/model';

export function mapFabricNormValues(value: unknown): FabricNormValues | null {
  if (value === null || value === undefined) return null;
  const norm = record(value, 'норма');
  return {
    oneColor: nullableNumber(norm['oneColor'], 'один колір'),
    twoColorsMain: nullableNumber(norm['twoColorsMain'], 'два кольори'),
    twoColorsAdditional: nullableNumber(norm['twoColorsAdditional'], 'два кольори'),
    threeColorsMain: nullableNumber(norm['threeColorsMain'], 'три кольори'),
    threeColorsAdditional1: nullableNumber(norm['threeColorsAdditional1'], 'три кольори'),
    threeColorsAdditional2: nullableNumber(norm['threeColorsAdditional2'], 'три кольори'),
  };
}

export function mapFabricNormRow(value: unknown): FabricNormRow {
  const row = record(value, 'рядок норм');
  return {
    modelCode: nonEmptyText(row['modelCode'], 'код моделі'),
    modelName: nullableText(row['modelName'], 'назва моделі'),
    modelIsActive: boolean(row['modelIsActive'], 'стан моделі'),
    productId: nullableInteger(row['productId'], 'товар моделі', 1),
    season: nullableText(row['season'], 'сезон'),
    norm: mapFabricNormValues(row['norm']),
    twoColorsTotal: nullableNumber(row['twoColorsTotal'], 'разом два кольори'),
    threeColorsTotal: nullableNumber(row['threeColorsTotal'], 'разом три кольори'),
    updatedAt: nullableDateTime(row['updatedAt'], 'час зміни'),
    problem: nullableText(row['problem'], 'проблема'),
  };
}

export const mapFabricNormRows = (value: unknown): FabricNormRow[] =>
  list(value, 'список норм').map(mapFabricNormRow);
