import { useSewingModel } from './use-sewing-model';
import { useSewingModelWrites } from './use-sewing-model-writes';
import { useSewingCard } from '../sewing-card/use-sewing-card';

/**
 * Everything the sewing card and the «Нова модель» steps show: the «Товари» row and live prices,
 * the model with its fabrics and shared composition, and its writes. Labour comes from the server
 * calculation, the same source as the «Товари» side panel.
 */
export function useSewingModelCard(productId: number) {
  const card = useSewingCard(productId);
  const model = useSewingModel(productId);
  // The code from «Товари» wins: «Редагувати» may have changed it after the card loaded.
  const modelCode = card.row ? card.row.code : model.modelCode;
  const writes = useSewingModelWrites(productId, model, modelCode);
  return { card, model, writes, modelCode, labourMinutes: card.totals.minutes ?? 0 };
}

export type SewingModelCard = ReturnType<typeof useSewingModelCard>;
