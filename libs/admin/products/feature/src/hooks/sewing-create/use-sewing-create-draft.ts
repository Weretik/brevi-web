import {
  isSewingCreateReady,
  sewingCreateChecklist,
  sewingCreateDoneSteps,
  sewingCreateLabour,
} from '@admin/products/model';

import { useSewingModelCard } from '../sewing-model/use-sewing-model-card';

/**
 * A saved «Нова модель» draft: the sewing card data and model writes, plus what the wizard derives
 * from them (readiness checklist, done steps, labour per shift).
 */
export function useSewingCreateDraft(productId: number) {
  const modelCard = useSewingModelCard(productId);
  const { card, model, labourMinutes } = modelCard;
  const articles = card.summaryLoaded ? card.articles : null;
  const checks = sewingCreateChecklist({
    articles,
    operations: model.draft?.operations ?? null,
  });

  return {
    ...modelCard,
    checks,
    ready: isSewingCreateReady(articles),
    done: sewingCreateDoneSteps({
      hasDraft: true,
      checks,
      active: card.row?.isActive ?? false,
    }),
    labourSummary: sewingCreateLabour(labourMinutes),
  };
}
