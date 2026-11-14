import { compositionLineKinds, compositionUnits } from '@admin/production/model';

import {
  boolean,
  decimal,
  list,
  nonEmptyText,
  nullableInteger,
  nullableText,
  oneOf,
  record,
} from '../../validators/production-response';

import type { ModelComposition, ModelCompositionLine, ModelLayer } from '@admin/production/model';

function mapLayer(value: unknown): ModelLayer {
  const layer = record(value, 'шар моделі');
  return {
    purpose: nonEmptyText(layer['purpose'], 'призначення'),
    code: nullableText(layer['code'], 'код матеріалу'),
    name: nullableText(layer['name'], 'матеріал'),
    quantity: decimal(layer['quantity'], 'норма'),
    unit: oneOf(layer['unit'], compositionUnits, 'одиниця'),
  };
}

function mapLine(value: unknown): ModelCompositionLine {
  const line = record(value, 'рядок комплектації');
  return {
    kind: oneOf(line['kind'], compositionLineKinds, 'вид складової'),
    article: nullableText(line['article'], 'артикул'),
    code: nullableText(line['code'], 'код матеріалу'),
    name: nullableText(line['name'], 'матеріал'),
    quantity: decimal(line['quantity'], 'норма'),
    unit: oneOf(line['unit'], compositionUnits, 'одиниця'),
    comment: nullableText(line['comment'], 'коментар'),
  };
}

export function mapModelComposition(value: unknown): ModelComposition {
  const row = record(value, 'комплектація моделі');
  return {
    modelCode: nonEmptyText(row['modelCode'], 'код моделі'),
    modelName: nonEmptyText(row['modelName'], 'назва моделі'),
    productId: nullableInteger(row['productId'], 'товар моделі', 1),
    season: nullableText(row['season'], 'сезон'),
    modelIsActive: boolean(row['modelIsActive'], 'стан моделі'),
    layers: list(row['layers'], 'шари моделі').map(mapLayer),
    lines: list(row['lines'], 'комплектація').map(mapLine),
  };
}

export const mapModelCompositions = (value: unknown): ModelComposition[] =>
  list(value, 'комплектація моделей').map(mapModelComposition);
