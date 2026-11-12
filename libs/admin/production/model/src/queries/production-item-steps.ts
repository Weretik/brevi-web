import { productionStages } from '../entities/production-tracking';

import type { ProductionItem } from '../entities/production-order';
import type { ProductionStage } from '../entities/production-tracking';

/**
 * The stages an item goes through, in workshop order: «Нове» is where it starts, not a step, and «Нанесення»
 * is left out when the item has no application (unless it was ticked anyway).
 */
export function itemStageSteps(
  item: Pick<ProductionItem, 'stages' | 'applications'>,
): ProductionStage[] {
  return productionStages.filter(
    (stage) =>
      stage !== 'New' &&
      (stage !== 'Application' ||
        item.applications.length > 0 ||
        item.stages.includes('Application')),
  );
}

/** The first step after the furthest ticked one; null when the item is at «Завершено». */
export function nextItemStage(
  item: Pick<ProductionItem, 'stages' | 'applications' | 'currentStage'>,
): ProductionStage | null {
  const current = productionStages.indexOf(item.currentStage);
  return itemStageSteps(item).find((stage) => productionStages.indexOf(stage) > current) ?? null;
}
