import {
  isSewingCreateReady,
  sewingCreateChecklist,
  sewingCreateDoneSteps,
  sewingCreateLabour,
} from '@admin/products/model';

import { useSewingCard } from '../sewing-card/use-sewing-card';
import { useSewingCardComposition } from '../sewing-card/use-sewing-card-composition';
import { useSewingCompositionController } from '../sewing-composition/use-sewing-composition-controller';

/**
 * A saved «Нова модель» draft: the sewing card data and composition controller, plus what the
 * wizard derives from them (readiness checklist, done steps, labour per shift).
 */
export function useSewingCreateDraft(productId: number) {
  const card = useSewingCard(productId);
  const controller = useSewingCompositionController(productId);
  const code = card.row?.code ?? null;
  const { labour, labourMinutes } = useSewingCardComposition(
    controller,
    code,
    Boolean(card.row),
    card.seamstressPerMinute,
  );
  const articles = card.summaryLoaded ? card.articles : null;
  const checks = sewingCreateChecklist({
    articles,
    operations: controller.drafts.modelDraft?.operations ?? null,
  });

  return {
    card,
    controller,
    labour,
    labourMinutes,
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
