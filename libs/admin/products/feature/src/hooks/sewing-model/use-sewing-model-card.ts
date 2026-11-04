import { sewingLabourLines } from '@admin/products/model';
import { useMemo } from 'react';

import { useSewingModel } from './use-sewing-model';
import { useSewingModelWrites } from './use-sewing-model-writes';
import { useSewingCard } from '../sewing-card/use-sewing-card';

/**
 * Everything the sewing card and the «Нова модель» steps show: the «Товари» row and live prices,
 * the model with its fabrics and shared composition, its writes and the labour per product.
 */
export function useSewingModelCard(productId: number) {
  const card = useSewingCard(productId);
  const model = useSewingModel(productId);
  // The code from «Товари» wins: «Редагувати» may have changed it after the composition loaded.
  const modelCode = card.row ? card.row.code : model.modelCode;
  const writes = useSewingModelWrites(productId, model, modelCode);
  const labourMinutes = useMemo(
    () =>
      sewingLabourLines(model.draft?.operations ?? [], model.operations, null).reduce(
        (sum, line) => sum + (line.minutes ?? 0),
        0,
      ),
    [model.draft?.operations, model.operations],
  );
  return { card, model, writes, modelCode, labourMinutes };
}

export type SewingModelCard = ReturnType<typeof useSewingModelCard>;
